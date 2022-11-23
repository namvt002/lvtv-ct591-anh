const db = require("../db");
const query = require("../lib/query");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        );
        cb(null, file.fieldname + "-" + Date.now() + ext);
    },
});

let upload = multer({
    storage: storage, limits: {
        fileSize: 100000000
    }
});

module.exports = function (app) {
    app.get('/api/baiviet', async (req, res) => {
        let _qr = `SELECT * FROM bai_viet `
        const {search} = req.query;
        if (search) _qr += `WHERE bv_tieude like '%${search}%' OR bv_mota like '%${search}%' OR bv_noidung like '%${search}%'
            OR 	bv_ngaytao like '%${search}%'
        `;
        return res.status(200).send(await query(db, _qr));
    });

    app.get('/api/baiviet/:id', async (req, res) => {
        return res.status(200).send(await query(db, `SELECT bai_viet.*, users.fullname FROM bai_viet LEFT JOIN users ON users.id = bv_iduser WHERE 
            bai_viet.bv_active = 1 AND bv_id = ?`, req.params.id));
    })

    app.get('/api/baiviet-user/:id', async (req, res) => {
        return res.status(200).send(await query(db, `SELECT bai_viet.*, users.fullname FROM bai_viet LEFT JOIN users ON users.id = bv_iduser WHERE 
            bai_viet.bv_active = 1 AND bv_iduser = ?`, req.params.id));
    })
    app.get('/api/baiviet-user', async (req, res) => {
        return res.status(200).send(await query(db, `SELECT bai_viet.*, users.fullname FROM bai_viet LEFT JOIN users ON users.id = bv_iduser `));
    })

    app.post('/api/baiviet', upload.single("bv_anh"), async (req, res) => {
        let {data, bv_iduser} = req.body;
        data = JSON.parse(data);
        if (!!req.file) data.bv_anh = req.file.filename;
        data.bv_iduser = bv_iduser;
        await query(db, `INSERT INTO bai_viet SET ?`, data);
        return res.status(200).send("ok");
    });

    app.put("/api/baiviet/:id", upload.single("kh_hinhanh"), async (req, res) => {
        const {id} = req.params;
        let data = req.body;
        await query(db, "UPDATE bai_viet SET ? WHERE bv_id = ?", [data, id]);
        return res.status(200).send("ok");
    })
    app.put('/api/baiviet-active', async (req, res) => {
        const {id, bv_active} = req.body;
        const qr = "UPDATE bai_viet SET bv_active = ? where bv_id = ?";
        await query(db, qr, [bv_active, id]);
        return res.status(200).send("Cập nhật thành công");
    });

    app.delete('/api/baiviet/:id', async (req, res) => {
        return res.status(200).send(
            await query(db, ` DELETE FROM bai_viet WHERE bv_id = ?`, req.params.id));
    })

    app.get('/api-v1/baiviet', async (req, res) => {
        let _qr = `SELECT bai_viet.*, users.fullname FROM bai_viet LEFT JOIN users ON users.id = bv_iduser WHERE 
            bai_viet.bv_active = 1 `
        const {search} = req.query;
        if (search) _qr += ` AND (
            bv_tieude like '%${search}%' OR bv_mota like '%${search}%' OR bv_noidung like '%${search}%'
            OR 	bv_ngaytao like '%${search}%'
            )
        `;
        return res.status(200).send(await query(db, _qr));
    });

}