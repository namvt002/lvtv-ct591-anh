const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {
    app.get('/diachi/:id', async (req, res) => {
        const {id} = req.params;
        const _qr = `SELECT * FROM dia_chi WHERE dc_idkh = ? AND active = 1 ORDER BY dc_macdinh desc`;
        return res.status(200).send(await query(db, _qr, id));
    });

    app.post('/diachi', async (req, res) => {
        const data = req.body;
        if (!data.dc_idkh) return res.status(500).send(null);
        if (data.dc_macdinh) {
            let _qr = "UPDATE dia_chi SET dc_macdinh = 0 WHERE dc_macdinh = 1";
            await query(db, _qr);
        }
        let _qr = "INSERT INTO dia_chi SET ?";
        await query(db, _qr, data);
        return res.status(200).send("Thêm thành công");
    });

    app.delete('/diachi/:id', async (req, res) => {
        const {id} = req.params;
        if (!id) return res.status(500).send(null);
        const _qr = 'UPDATE dia_chi SET active = 0 WHERE dc_id = ?';
        await query(db, _qr, id);
        return res.status(200).send("Xóa thành công!");
    });
}