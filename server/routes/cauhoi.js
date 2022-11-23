const db = require("../db");
const query = require("../lib/query");
const sql = require("../db");

module.exports = function (app) {
    app.post("/api/baikiemtra", async (req, res) => {
        const {cauhoi, baikiemtra} = req.body;
        let check = await query(db, 'SELECT * FROM bai_kiem_tra WHERE bkt_idkh =?', baikiemtra.bkt_idkh);
        if (check.length !== 0) return res.status(500).send("Khóa học đã có bài kiểm tra");
        const _bkt = await query(db, `INSERT INTO bai_kiem_tra SET ?`, baikiemtra);
        await Promise.all(cauhoi.map(async e => {
            let ch = {
                chkt_noidung: e.ch_noidung,
                chkt_loaicauhoi: e.ch_loaicauhoi.id,
                chkt_idbkt: _bkt.insertId,
                chkt_active: e.ch_active
            }
            const _chkt = await query(db, `INSERT INTO cau_hoi_kiem_tra SET ?`, ch);
            await Promise.all(e.ch_dapan.map(async (e1, idx) => {
                let da = {
                    dach_dapan: e1,
                    dach_dapandung: e.ch_dapandung.findIndex(el => el === (idx + 1).toString()) !== -1,
                    dach_idchkt: _chkt.insertId
                }
                await query(db, `INSERT INTO dap_an_cau_hoi SET ?`, da);
            }))
        }))
        return res.status(200).send("ok");
    });

    app.put("/api/baikiemtra/:id", async (req, res) => {
        const {id} = req.params;
        const {cauhoi, baikiemtra} = req.body;
        const _bkt = await query(db, `UPDATE bai_kiem_tra SET ? WHERE bkt_id = ?`, [baikiemtra, id]);
        await query(db, "DELETE from cau_hoi_kiem_tra WHERE chkt_idbkt = ?", id);
        await Promise.all(cauhoi.map(async e => {
            let ch = {
                chkt_noidung: e.ch_noidung,
                chkt_loaicauhoi: !!e.ch_loaicauhoi?.id ? e.ch_loaicauhoi.id : e.ch_loaicauhoi,
                chkt_idbkt: id,
                chkt_active: e.ch_active
            }
            const _chkt = await query(db, `INSERT INTO cau_hoi_kiem_tra SET ?`, ch);
            await Promise.all(e.ch_dapan.map(async (e1, idx) => {
                let da = {
                    dach_dapan: e1,
                    dach_dapandung: e.ch_dapandung.findIndex(el => el === (idx + 1).toString()) !== -1,
                    dach_idchkt: _chkt.insertId
                }
                await query(db, `INSERT INTO dap_an_cau_hoi SET ?`, da);
            }))
        }))
        return res.status(200).send("ok");

    })

    app.get("/api/baikiemtra", async (req, res) => {
        const {search} = req.query;
        let _qr = `SELECT
                        khoa_hoc.kh_makh,
                        khoa_hoc.kh_ten,
                        bai_kiem_tra.bkt_ten,
                        bai_kiem_tra.bkt_thoigian,
                        bai_kiem_tra.bkt_active,
                        bai_kiem_tra.bkt_id
                    FROM
                        \`bai_kiem_tra\`
                    LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_kiem_tra.bkt_idkh `;
        if (!!search) _qr += `WHERE 
                                kh_makh like '%${search}%' OR 
                                kh_ten like '%${search}%' OR 
                                bkt_ten like '%${search}%' OR
                                bkt_thoigian like '%${search}%'`;
        return res.status(200).send(await query(db, _qr))
    });


    app.get("/api/baikiemtra/:id", async (req, res) => {
        const {id} = req.params;
        let _qr = `SELECT
                        *
                    FROM
                        \`bai_kiem_tra\`
                    LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_kiem_tra.bkt_idkh WHERE bai_kiem_tra.bkt_id = ?`;
        let _baikiemtra = await query(db, _qr, id);
        let data = {};
        if (_baikiemtra.length > 0) {
            data.baikiemtra = {
                bkt_ten: _baikiemtra[0].bkt_ten,
                bkt_thoigian: _baikiemtra[0].bkt_thoigian,
                bkt_idkh: _baikiemtra[0].bkt_idkh,
                bkt_active: _baikiemtra[0].bkt_active,
                kh_id: _baikiemtra[0].kh_id,
                kh_ten: _baikiemtra[0].kh_ten,
                bkt_id: _baikiemtra[0].bkt_id
            }
            let _cauhoi = await query(db, `SELECT
                                                    chkt_noidung ch_noidung,
                                                    chkt_id ch_id,
                                                    chkt_active ch_active,
                                                    chkt_loaicauhoi ch_loaicauhoi
                                                FROM
                                                    cau_hoi_kiem_tra
                                                WHERE
                                                    chkt_idbkt = ?`, _baikiemtra[0].bkt_id);
            await Promise.all(_cauhoi.map(async (e, idx) => {
                let _da = await query(db, "SELECT * FROM dap_an_cau_hoi WHERE dach_idchkt = ? ORDER BY dach_idchkt", e.ch_id);
                let ch_dapan = [];
                let ch_dapandung = [];
                _da.map((e, idx1) => {
                    ch_dapan.push(e.dach_dapan);
                    if (!!e.dach_dapandung) ch_dapandung.push((idx1 + 1).toString());
                });
                _cauhoi[idx].ch_dapan = ch_dapan;
                _cauhoi[idx].ch_dapandung = ch_dapandung;
            }))
            data.cauhoi = _cauhoi

        }
        return res.status(200).send(data)
    });

    app.put('/api/baikiemtra-active', async (req, res) => {
        const {id, active, arrID} = req.body;
        const qr = "UPDATE bai_kiem_tra SET bkt_active = ? where bkt_id = ?";
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

//###############################################################################################3
    app.get("/api-v1/baikiemtra/:id", async (req, res) => {
        const {id} = req.params;
        let _qr = `SELECT
                        *
                    FROM
                        \`bai_kiem_tra\`
                    LEFT JOIN khoa_hoc ON khoa_hoc.kh_id = bai_kiem_tra.bkt_idkh WHERE khoa_hoc.kh_makh = ?`;
        let _baikiemtra = await query(db, _qr, id);
        let data = {};
        if (_baikiemtra.length > 0) {
            data.baikiemtra = {
                bkt_ten: _baikiemtra[0].bkt_ten,
                bkt_thoigian: _baikiemtra[0].bkt_thoigian,
                bkt_idkh: _baikiemtra[0].bkt_idkh,
                bkt_active: _baikiemtra[0].bkt_active,
                kh_id: _baikiemtra[0].kh_id,
                kh_ten: _baikiemtra[0].kh_ten,
                bkt_id: _baikiemtra[0].bkt_id
            }
            let _cauhoi = await query(db, `SELECT
                                                    chkt_noidung ch_noidung,
                                                    chkt_id ch_id,
                                                    chkt_active ch_active,
                                                    chkt_loaicauhoi ch_loaicauhoi
                                                FROM
                                                    cau_hoi_kiem_tra
                                                WHERE
                                                    chkt_idbkt = ?`, _baikiemtra[0].bkt_id);
            await Promise.all(_cauhoi.map(async (e, idx) => {
                let _da = await query(db, "SELECT * FROM dap_an_cau_hoi WHERE dach_idchkt = ? ORDER BY dach_idchkt", e.ch_id);
                let ch_dapan = [];
                let ch_dapandung = [];
                let ch_idda = [];
                _da.map((e, idx1) => {
                    ch_dapan.push(e.dach_dapan);
                    ch_idda.push(e.dach_id);
                    if (!!e.dach_dapandung) ch_dapandung.push((idx1 + 1).toString());
                });
                _cauhoi[idx].ch_dapan = ch_dapan;
                _cauhoi[idx].ch_idda = ch_idda;
            }))
            data.cauhoi = _cauhoi

        }
        return res.status(200).send(data)
    });
    function checkDapAn (arr1, arr2){
        if(arr1.length === 0 ||  arr2.length === 0) return 0;
        let correct = 0;
        arr1.map(e =>{
            let index = arr2.findIndex(el => parseInt(el) === parseInt(e));
            if(index !== -1) correct++;
            return correct;
        })
        return (correct/ arr2.length);
    }

    app.post('/api-v1/ketquakiemtra', async (req, res)=>{
        const data = req.body;
        console.log(data);
        let ketqua = [];
        await Promise.all(
            data.selectValues.map(async (dataClient, idx)=>{
                let qr = `
                        SELECT * FROM dap_an_cau_hoi WHERE dach_idchkt = ? AND dach_dapandung = 1
                        `;
                let tmp =  await query(db, qr, [ dataClient.ch_id] );
                // arr1.push();
                let tempKetQua  = checkDapAn((dataClient.ch_idda),(tmp.map(e=>e.dach_id)));
                ketqua.push(tempKetQua);
            })
        )
        let phatram = ketqua.reduce((acc, curr)=> acc + curr, 0);

        if((phatram/ ketqua.length)*100 >= 70){

            let qrcc =  `
                INSERT INTO chung_chi SET ?
            `;
            await query(db, qrcc, [{
                cc_iduser: data.userid,
                cc_idbkt: data.idbkt,
                cc_diem: (phatram/ ketqua.length)*100
            }]);
            return res.status(200).send({
                message: "pass",
                points: (phatram/ ketqua.length)*100,
            })
        }else{
            return res.status(200).send({
                message: "fail",
                points: (phatram/ ketqua.length)*100,
            })
        }
    })
    app.get("/api-v1/chungchi", async (req, res) => {
        const {iduser} = req.query;
        const qr = `
              SELECT * FROM bai_kiem_tra 
                JOIN chung_chi 
                    ON bai_kiem_tra.bkt_id = chung_chi.cc_idbkt 
                        JOIN khoa_hoc 
                            ON bai_kiem_tra.bkt_idkh = khoa_hoc.kh_id
                              WHERE chung_chi.cc_iduser = ?
        `;

        return res.status(200).send(await query(db, qr, [iduser]));
    });
    app.get("/api-v1/kiemtra-chungchi", async (req, res) => {
        const {iduser, kh_makh} = req.query;
        const qr = `
             SELECT * FROM bai_kiem_tra 
                JOIN chung_chi 
                    ON bai_kiem_tra.bkt_id = chung_chi.cc_idbkt 
                        JOIN khoa_hoc 
                            ON bai_kiem_tra.bkt_idkh = khoa_hoc.kh_id
                              WHERE chung_chi.cc_iduser = ? AND khoa_hoc.kh_makh = ?
        `;

        return res.status(200).send(await query(db, qr, [iduser, kh_makh]));
    });
}