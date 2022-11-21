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

    app.post('/api/baihoc', async (req, res) => {
        const data = req.body;

        let bai_hoc = {
            bh_ten: data.bh_ten,
            bh_idkh: data.bh_idkh.kh_id,
            active: data.active
        };

        let _bh = await query(db, "INSERT INTO bai_hoc SET ?", bai_hoc);

        let ndbh = [];

        data.bai_hoc.map(e => ndbh.push([e.bh_mota, e.bh_code, e.bh_lang.id, e.bh_active, e.bh_tieude, _bh.insertId]));

        await query(db, `INSERT INTO noi_dung_bai_hoc(ndbh_mota, ndbh_code, ndbh_code_lang, ndbh_code_run, ndbh_tieude, ndbh_idbh) VALUES ?`, [ndbh])

        return res.status(200).send("ok");
    });

    app.put('/api/baihoc/:id', async (req, res) => {
        const data = req.body;
        const {id} = req.params;

        let bai_hoc = {
            bh_ten: data.bh_ten,
            bh_idkh: data.bh_idkh.kh_id,
            active: data.active
        };

        let _bh = await query(db, "UPDATE bai_hoc SET ? WHERE bai_hoc.bh_idkh = ?", [bai_hoc, id]);

        let ndbh = [];

        await query(db, "DELETE FROM noi_dung_bai_hoc WHERE ndbh_idbh  = ?", id);

        data.bai_hoc.map(e => ndbh.push([e.bh_mota, e.bh_code, e.bh_lang?.id || '', e.bh_active, e.bh_tieude, id]));

        await query(db, `INSERT INTO noi_dung_bai_hoc(ndbh_mota, ndbh_code, ndbh_code_lang, ndbh_code_run, ndbh_tieude, ndbh_idbh) VALUES ?`, [ndbh])

        return res.status(200).send("ok");
    });

    app.get("/api/baihoc", async (req, res) => {
        let {search} = req.query;
        let _qr = `SELECT
                        khoa_hoc.*,
                        bai_hoc.bh_id,
                        bai_hoc.bh_ten,
                        bai_hoc.active bh_active
                    FROM
                        bai_hoc
                    LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_hoc.bh_idkh `;
        if (!!search) {
            _qr += `WHERE kh_makh like '%${search}%' OR kh_ten like '%${search}%' OR bh_ten like '%${search}%'`
        }
        return res.status(200).send(await query(db, _qr));
    });

    app.put('/api/baihoc-active', async (req, res) => {
        const {id, active, arrID} = req.body;
        const qr = "UPDATE bai_hoc SET active = ? where bh_id = ?";
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

    app.get("/api/noidungbaihoc/:id", async (req, res) => {
        const bai_hoc = await query(db, `SELECT
                                                khoa_hoc.*,
                                                bai_hoc.bh_id,
                                                bai_hoc.bh_ten,
                                                bai_hoc.active bh_active
                                            FROM
                                                bai_hoc
                                            LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_hoc.bh_idkh WHERE bai_hoc.bh_id = ?`, req.params.id);
        if (bai_hoc.length > 0) await Promise.all(bai_hoc.map(async (e, idx) => bai_hoc[idx].noi_dung = await query(db, `SELECT
                                                                                                                                ndbh_id,
                                                                                                                                ndbh_mota bh_mota,
                                                                                                                                ndbh_code bh_code,
                                                                                                                                ndbh_code_lang bh_lang,
                                                                                                                                ndbh_code_run bh_active,
                                                                                                                                ndbh_tieude bh_tieude
                                                                                                                            FROM
                                                                                                                                noi_dung_bai_hoc WHERE ndbh_idbh = ?`, e.bh_id)));
        return res.status(200).send(bai_hoc);
    })

    // ###################################################################################################

    app.get("/api-v1/khoahoc", async (req, res) => {
        let _qr = `SELECT
                        khoa_hoc.*,
                    IFNULL( SUM(bai_kiem_tra.bkt_active),0) num_bkt
                    FROM
                        khoa_hoc LEFT JOIN bai_kiem_tra ON bai_kiem_tra.bkt_idkh = khoa_hoc.kh_id
                    WHERE
                        active = 1`
        const {search} = req.query;
        if (search) _qr += `AND (kh_makh like '%${search}%' OR kh_ten like '%${search}%' or kh_create_at like '%${search}%')`;
        _qr += ` GROUP BY khoa_hoc.kh_id`;
        return res.status(200).send(await query(db, _qr));
    });

    app.get("/api-v1/khoahoc/:makh", async (req, res) => {
        const {makh} = req.params;
        return res.status(200).send(await query(db, `SELECT
                                            *
                                        FROM
                                            bai_hoc
                                        LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_hoc.bh_idkh
                                        WHERE
                                            khoa_hoc.kh_makh = ?`, makh));
    });

    app.get("/api-v1/baihoc/:id", async (req, res) => {
        const {id} = req.params;
        return res.status(200).send(await query(db, `SELECT
                                                            noi_dung_bai_hoc.*
                                                        FROM
                                                            bai_hoc
                                                        LEFT JOIN noi_dung_bai_hoc ON noi_dung_bai_hoc.ndbh_idbh = bai_hoc.bh_id
                                                        WHERE
                                                            bai_hoc.bh_id = ?`, id));
    })

}