const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {
    app.get('/store', async (req, res) => {
        let _cuahang = await query(db, "SELECT * FROM cua_hang");
        return res.status(200).send(_cuahang[0]);
    });

    app.post("/store", async (req, res) => {
        const _data = req.body;
        await query(db, "INSERT INTO cua_hang SET ?", _data);
        return res.status(200).send("Them thanh cong")

    });

    app.put('/store/:id', async (req, res) => {
        const {id} = req.params;
        const _data = req.body;
        await query(db, "UPDATE cua_hang SET ? WHERE id = ?", [_data, id]);
        return res.status(200).send("Cập nhật thành công")
    });

}