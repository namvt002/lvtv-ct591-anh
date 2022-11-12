const query = require("../lib/query");
const db = require("../db");
const sql = require("../db");

module.exports = function (app) {
    app.post("/phieunhap", async (req, res) => {
        let _sanpham = req.body.sanpham;
        let _phieunhap = req.body;
        delete _phieunhap.sanpham;
        const qr_phieunhap = "INSERT INTO phieu_nhap SET ?";
        await db.query(qr_phieunhap, _phieunhap, async (err, _rs_pn) => {
            if (err) {
                console.log(err);
            }
            let id_pn = _rs_pn.insertId;
            let _spArr = [];
            _sanpham.map((e) =>
                _spArr.push([e.ctpn_idsp, e.ctpn_soluong, e.ctpn_gia, id_pn])
            );
            const qr_ctpn =
                "INSERT INTO chi_tiet_phieu_nhap(ctpn_idsp, ctpn_soluong, ctpn_gia, ctpn_idpn) VALUES ?";
            await db.query(qr_ctpn, [_spArr], (err, __) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.status(200).send("Thêm thành công");
        });
    });

    app.get("/phieunhap", async (req, res) => {
        const qr_pn = `
        SELECT phieu_nhap.*, users.fullname, nha_cung_cap.ncc_ten
        FROM phieu_nhap
        LEFT JOIN users ON users.id = phieu_nhap.pn_idnv
        LEFT JOIN nha_cung_cap ON nha_cung_cap.ncc_id = phieu_nhap.pn_idncc ORDER BY pn_id DESC
    `;
        return res.status(200).send(await query(db, qr_pn));
    });

    app.get("/phieunhap/:id", async (req, res) => {
        const {id} = req.params;
        const qr_pn = `
                    SELECT chi_tiet_phieu_nhap.*, sp_ten, ncc_ten, fullname, sp_masp, phieu_nhap.*, ncc_id
                      FROM chi_tiet_phieu_nhap 
                      LEFT JOIN san_pham ON ctpn_idsp = san_pham.sp_id
                      LEFT JOIN phieu_nhap ON phieu_nhap.pn_id = ctpn_idpn
                      LEFT JOIN nha_cung_cap ON ncc_id = pn_idncc
                      LEFT JOIN users ON users.id = pn_idnv
                    WHERE ctpn_idpn = ?`;
        return res.status(200).send(await query(db, qr_pn, id));
    });


    app.delete("/phieunhap", async (req, res) => {
        if (!!req.body.arrID) {
            const arrID = JSON.parse(req.body.arrID);
            await Promise.all(
                arrID.map(async (e) => {
                    let qr = "DELETE FROM phieu_nhap where pn_id = ?";
                    await sql.query(qr, [e], (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                    await sql.query("DELETE FROM chi_tiet_phieu_nhap where ctpn_idpn = ?", [e], (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                })
            );
            return res.status(201).send("Xóa thành công!");
        }
    });

    app.put('/phieunhap/:id', async (req, res) => {
        const {id} = req.params;
        let _sanpham = req.body.sanpham;
        let _phieunhap = req.body;
        delete _phieunhap.sanpham;

        const qr_pn = "UPDATE phieu_nhap SET ? WHERE pn_id = ?";
        await query(db, qr_pn, [_phieunhap, id]);

        const qr_dpn = "DELETE FROM chi_tiet_phieu_nhap WHERE ctpn_idpn = ?";
        await query(db, qr_dpn, id);

        let _spArr = [];
        _sanpham.map((e) =>
            _spArr.push([e.ctpn_idsp, e.ctpn_soluong, e.ctpn_gia, id])
        );


        const qr_ctpn = "INSERT INTO chi_tiet_phieu_nhap(ctpn_idsp, ctpn_soluong, ctpn_gia, ctpn_idpn) VALUES ?";
        await query(db, qr_ctpn, [_spArr]);

        return res.status(200).send("Cập nhật thành công!")
    });

    app.post("/phieunhap/active", async (req, res) => {
        const {id, pn_active} = req.body;
        if (!id) return res.status(404).send("No content");
        await query(db, `UPDATE phieu_nhap SET pn_active = ? where pn_id = ?`, [pn_active, id])
        return res.status(200).send("Cập nhật thành công");
    });

};
