const sql = require("../db");
const bcrypt = require("bcryptjs");
const {sendEmail} = require("../lib/sendMail");
const query = require('../lib/query');

module.exports = function (app) {
    app.get("/users", async (req, res) => {
        if (req.query.search) {
            return await sql.query(
                `
          select users.*, q_ten  as role
          from users left join quyen on users.role_id = quyen.q_id
          where email like '%${req.query.search}%' or 
                phone like '%${req.query.search}%' or
                fullname like '%${req.query.search}%' or
                q_ten like '%${req.query.search}%'
          `,
                (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                    return res.status(200).json(data);
                }
            );
        } else
            return await sql.query(
                "select users.*, q_ten  as role from users left join quyen on users.role_id = quyen.q_id",
                (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                    return res.status(200).json(data);
                }
            );
    });

    app.post("/user/active", async (req, res) => {
        const {id, active} = req.body;
        if (!id) return res.status(404).send("No content");
        const qr = "UPDATE users SET active = ? where id = ?";
        sql.query(qr, [active, id], (err, _) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.status(200).send("Cập nhật thành công");
        });
    });

    app.delete("/user/delete", async (req, res) => {
        if (!!req.body.arrID) {
            const arrID = JSON.parse(req.body.arrID);
            await Promise.all(
                arrID.map(async (e) => {
                    let qr = "DELETE FROM users where id = ?";
                    await sql.query(qr, [e], (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                })
            );
            return res.status(201).send("Xóa thành cồng!");
        }
    });
    app.get("/user/:id", async (req, res) => {
        const {id} = req.params;
        if (!id) return res.status(404).send(null);
        const qr = " SELECT * FROM users where id = ?";
        await sql.query(qr, id, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(data);
        });
    });

    app.get("/user/:email/email", async (req, res) => {
        const {email} = req.params;
        if (!email) return res.status(404).send(null);
        const qr = " SELECT * FROM users where email = ?";
        await sql.query(qr, email, (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(data[0]);
        });
    });


    app.put("/user/:id/edit", async (req, res) => {
        const {id} = req.params;
        const data = req.body;
        const qr = "UPDATE `users` SET ? WHERE `users`.`id` = ?;";
        await query(sql, qr, [data, id]);
        let _user = await query(sql, "select users.*, q_ten  as role from users left join quyen on users.role_id = quyen.q_id WHERE id = ?", id);
        res.cookie("user", JSON.stringify(_user[0]));
        return res.status(200).send("Cập nhật thành công");

    });

    app.post("/user/create", async (req, res) => {
        let data = req.body;
        let send_pwd = data.credential;
        data.credential = bcrypt.hashSync(data.credential, 8);
        const qr_user = " SELECT * FROM users WHERE email = ?";

        await sql.query(qr_user, [data.email], async (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length !== 0) {
                return res.status(500).send("Email đã tồn tại");
            } else {
                const qr =
                    "INSERT into `users`(fullname, email, phone, birthday, role_id, credential, gender, verify) VALUES (?,?,?,?,?,?,?,?)";
                await sql.query(qr, [
                    data.fullname,
                    data.email,
                    data.phone,
                    data.birthday,
                    data.role_id,
                    data.credential,
                    data.gender,
                    data.verify,
                ]);
                const optionsSendMail = {
                    to: data.email, // list of receivers
                    subject: "Tài khoản LearnCode shop", // Subject line
                    html: `<h1>Chào <span style="color: red">${data.fullname}</span></h1>
          <h5>Tài khoản của bạn là:</h5>
                  <div>
                    <span>Tài khoản: </span><span>${data.email}</span>
                    <span>Mật khẩu: </span><span>${send_pwd}</span>
                  </div>`,
                };
                sendEmail(optionsSendMail);
                return res.status(200).send("Tạo tài khoản thành thành công");
            }
        });
    });
};
