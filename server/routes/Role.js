const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {
    // lay danh sach quyen
    app.get("/role", async (req, res) => {
        let qr = "SELECT * FROM quyen ";
        if (req.query.search) {
            qr += `WHERE q_ten like '%${req.query.search}%' or q_vaitro like '%${req.query.search}%' or q_mota like '%${req.query.search}%'`;
        }
        return res.status(200).send(await query(db, qr));
    });

    // Cap nhat trang thai
    app.post("/role/active", async (req, res) => {
        const {id, active} = req.body;
        if (!id) return res.status(404).send("No content");
        const qr = "UPDATE quyen SET active = ? where q_id = ?";
        await query(db, qr, [active, id]);
        return res.status(200).send("Cập nhật thành công");
    });

    // lay trang thai co id = ?
    app.get("/role/:id", async (req, res) => {
        const {id} = req.params;
        if (!id) return res.status(404).send(null);
        return res.status(200).send(await query(db, "SELECT * FROM quyen where q_id = ?", id));
    });

    // cap nhat trang thai cos id = ?
    app.put("/role/:id/edit", async (req, res) => {
        const {id} = req.params;
        const data = req.body;
        const qr = "UPDATE quyen SET ? WHERE q_id = ?";
        await query(db, qr, [data, id]);
        return res.status(200).send("Cập nhật thành công!");
    });

    // tao trang thai moi
    app.post("/role/create", async (req, res) => {
        const data = req.body;
        const qr_exist = "SELECT * FROM quyen where q_ten = ?";
        const isExit = await query(db, qr_exist, data.q_ten);
        if (isExit.length > 0) return res.status(500).send("Tên đã tồn tại");
        const qr = "INSERT INTO quyen SET ?";
        await query(db, "INSERT INTO quyen SET ?", data);
        return res.status(200).send("Thêm thành công!");
    });

    //Xoa quyen
    app.delete("/role/delete", async (req, res) => {
        if (!!req.body.arrID) {
            const arrID = JSON.parse(req.body.arrID);
            await Promise.all(
                arrID.map(async (e) => await query(db, "DELETE FROM quyen where q_id = ?", [e]))
            );
        }
        return res.status(201).send("Xóa thành công!");
    });
};
