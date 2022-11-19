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
    app.get('/api/khoahoc', async (req, res) => {
        let _qr = `SELECT * FROM khoa_hoc `
        const {search} = req.query;
        if (search) _qr += `WHERE kh_makh like '%${search}%' OR kh_ten like '%${search}%' or kh_create_at like '%${search}%'`;
        return res.status(200).send(await query(db, _qr));
    });

    app.get('/api/khoahoc/:id', async (req, res) => {
        return res.status(200).send(await query(db, `SELECT * FROM khoa_hoc WHERE kh_id = ?`, req.params.id));
    })

    app.post('/api/khoahoc', upload.single("kh_hinhanh"), async (req, res) => {
        let {data} = req.body;
        data = JSON.parse(data);
        data.kh_hinhanh = req.file.filename;
        await query(db, `INSERT INTO khoa_hoc SET ?`, data);
        return res.status(200).send("ok");
    });

    app.put("/api/khoahoc/:id", upload.single("kh_hinhanh"), async (req, res) => {
        const {id} = req.params;
        let {data} = req.body;
        data = JSON.parse(data);
        if (!!req.file) data.kh_hinhanh = req.file.filename;
        else delete data.kh_hinhanh;
        await query(db, "UPDATE khoa_hoc SET ? WHERE kh_id = ?", [data, id]);
        return res.status(200).send("ok");
    })
    app.put('/api/khoahoc-active', async (req, res) => {
        const {id, active, arrID} = req.body;
        const qr = "UPDATE khoa_hoc SET active = ? where kh_id = ?";
        if (!!arrID) {
            let _arrID = JSON.parse(arrID);
            await Promise.all(
                _arrID.map(async e => await query(db, qr, [active, e]))
            )
        } else {
            await query(db, qr, [active, id]);
        }
        return res.status(200).send("Cập nhật thành công");
    });

}