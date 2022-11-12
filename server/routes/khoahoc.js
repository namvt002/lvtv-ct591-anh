const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {
    app.get('/api/khoahoc', async (req, res)=>{
        return res.status(200).send(await query(db, `SELECT * FROM khoa_hoc`));
    })
}