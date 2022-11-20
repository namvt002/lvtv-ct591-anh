const db = require("../db");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../lib/sendMail");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const query = require("../lib/query");

//-------------------------------------------------------------------------------------------
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

module.exports = function (app) {
    app.get("/auth/verify/email", async (req, res) => {
        const tokenEmail = req.query.token;
        const decode = jwt.verify(tokenEmail, process.env.SECRET);
        const token = jwt.sign({ email: decode.email }, process.env.SECRET, {
            expiresIn: 86400, // 24h
        });
        const sql = `UPDATE users SET verify = '1' WHERE email = '${decode.email}'`;
        const sql_user =
            "select users.*, q_ten  as role from users left join quyen on users.role_id = quyen.q_id WHERE email = ?";
        await db.query(sql);
        await db.query(sql_user, decode.email, (err, user) => {
            if (err) return res.status(500).send(err);
            if (user.length === 0)
                return res.status(404).send("Tài khoản không tồn tại");
            res.cookie("token", token, { expire: new Date() + 86400 });
            res.cookie("user", JSON.stringify(user[0]));
            return res.redirect("http://localhost:3000");
        });
    });
    app.post("/user/register", async (req, res) => {
        const { fullname, email, password } = req.body;
        await db.query(
            "select users.*, q_ten  as role from users left join quyen on users.role_id = quyen.q_id WHERE email = ?",
            email,
            async (err, data) => {
                if (err) return res.status(500);
                if (data.length !== 0) {
                    return res.status(500).send("Email đã tồn tại");
                } else {
                    const tokenEmail = jwt.sign({ email: email }, process.env.SECRET, {
                        expiresIn: 18000, // 5m
                    });
                    const sql_insert =
                        "\
                                              INSERT INTO `users` (`email`, `fullname`, `credential`) VALUES (?,?,?)";
                    await db.query(sql_insert, [
                        email,
                        fullname,
                        bcrypt.hashSync(password, 8),
                    ]);
                    const URL = `http://localhost:4000/auth/verify/email?token=${tokenEmail}`;
                    const optionsSendMail = {
                        to: email, // list of receivers
                        subject: "Verify Account", // Subject line
                        html:
                            '<p>Please click this link to verify your account <b><a href="' +
                            URL +
                            '"> Click here </a></b></p>',
                    };
                    sendEmail(optionsSendMail);
                    return res.status(200).send("Successfully!");
                }
            }
        );
    });

    app.post("/auth/login", async (req, res) => {
        const { email, password } = req.body;
        const sql_user = `  SELECT users.*, q_ten AS role
                            FROM users
                            LEFT JOIN quyen ON users.role_id = quyen.q_id
                            WHERE email = ?`;
        const user = await query(db, sql_user, email);

        if (user.length === 0) {
            return res.status(404).send("Tài khoản không tồn tại!");
        }

        if (!Number(user[0].active))
            return res.status(404).send("Tài khoản đã bị vô hiệu hóa!");

        if (user[0].verify === 0) {
            const tokenEmail = jwt.sign({ email: email }, process.env.SECRET, {
                expiresIn: 18000, // 5m
            });
            const URL = `http://localhost:4000/auth/verify/email?token=${tokenEmail}`;
            const optionsSendMail = {
                to: email, // list of receivers
                subject: "Verify Account", // Subject line
                html:
                    '<p>Please click this link to verify your account <b><a href="' +
                    URL +
                    '"> Click here </a></b></p>',
            };
            sendEmail(optionsSendMail);
            return res
                .status(400)
                .send(
                    "Tài khoản của bạn chưa kích hoạt vui lòng check mail để kích hoạt"
                );
        }

        if (!user[0].credential)
            return res
                .status(401)
                .send("Vui lòng đăng nhập tài khoản google để đổi mật khẩu");
        const passwordIsValid = bcrypt.compareSync(password, user[0].credential);
        if (!passwordIsValid) {
            return res.status(401).send("Mật khẩu không chính xác");
        }
        const token = jwt.sign({ email: email }, process.env.SECRET, {
            expiresIn: 86400, // 24m
        });
        res.cookie("token", token, {
            expire: new Date() + 86400,
        });
        res.cookie("user", JSON.stringify(user[0]));
        return res.status(200).send("successfully!");
    });

    app.get("/auth/login/google", isLoggedIn, async (req, res) => {
        const token = jwt.sign({ email: req.user.email }, process.env.SECRET, {
            expiresIn: 86400, // 24h
        });

        let _qr = `select users.*, q_ten  as role from users left join quyen on users.role_id = quyen.q_id WHERE email = ?`;
        const user = await query(db, _qr, req.user.email);
        if (user.length !== 0) {
            if (!Number(user[0].active))
                return res.redirect("http://localhost:3000/auth/login?noErr=2");
            res.cookie("token", token, { expire: new Date() + 86400 });
            res.cookie("user", JSON.stringify(user[0]));
            if (user[0].role === "ADMIN")
                return res.redirect("http://localhost:3000/dashboard");
            return res.redirect("http://localhost:3000");
        } else {
            let sql =
                "INSERT INTO `users` (`user_id`, `email`, `fullname`, `verify`) VALUES (?)";
            let newUser = await query(db, sql, [
                [req.user.id, req.user.email, req.user.displayName, 1],
            ]);
            let _user = {
                id: newUser.insertId,
                email: req.user.email,
                fullname: req.user.displayName,
                phone: "",
                gender: "",
                birthday: "",
                role_id: 1,
                role: "USER",
            };
            res.cookie("token", token, { expire: new Date() + 86400 });
            res.cookie("user", JSON.stringify(_user));
            return res.redirect("http://localhost:3000");
        }
    });

    app.post("/auth/forgot-password", async (req, res) => {
        const { email } = req.body;
        const token = jwt.sign({ email: email }, process.env.SECRET, {
            expiresIn: 86400, // 24h
        });
        const URL = `http://localhost:3000/auth/reset-password/${token}`;
        const optionsSendMail = {
            to: email, // list of receivers
            subject: "Quên mật khẩu", // Subject line
            html:
                '<p>Vui lòng nhấn vào link này để cập nhật mật khẩu <b><a href="' +
                URL +
                '"> link</a></b></p>',
        };
        sendEmail(optionsSendMail);
        return res.status(200).send("ok");
    });

    app.post("/auth/change-password", async (req, res) => {
        const { email, password, newPass } = req.body;
        const qr_user = `SELECT * FROM users WHERE email = ?`;
        const _user = await query(db, qr_user, email);
        if (_user.length === 0) return res.status(404).send("user not found!");
        if (_user[0].credential) {
            const passwordIsValid = bcrypt.compareSync(password, _user[0].credential);
            if (!passwordIsValid)
                return res.status(500).send("Mật khẩu cũ không chính xác");
        }
        await query(db, "UPDATE users SET credential = ? WHERE email = ?", [
            bcrypt.hashSync(newPass, 8),
            email,
        ]);
        return res.status(200).send("Đổi mật khẩu thành công!");
    });

    app.post("/auth/reset-password", async (req, res) => {
        const { token, newPass } = req.body;
        const decode = jwt.verify(token, process.env.SECRET);
        if (decode.email) {
            await query(db, "UPDATE users SET credential = ? WHERE email = ?", [
                bcrypt.hashSync(newPass, 8),
                decode.email,
            ]);
            return res.status(200).send("Đổi mật khẩu thành công!");
        }
        return res.status(500).send(null);
    });
};