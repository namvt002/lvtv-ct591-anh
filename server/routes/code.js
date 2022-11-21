let path = require('path');
const fs = require('fs');
const {PythonShell} = require('python-shell');
const {spawn} = require("child_process");

module.exports = function (app) {

    app.get('/api-v1/runcode', async (req, res) => {
        const {id} = req.query;
        return res.sendFile(path.resolve(__dirname + `/../public/views/pro_${id}.html`));
    });

    app.post('/api-v1/runcode', async (req, res) => {
        const {code, lang, id} = req.body;
        if (lang === 'html' || lang === 'javascript' || lang === 'css') {
            console.log(lang)
            try {
                fs.writeFileSync(__dirname + `/../public/views/pro_${id}.html`, code);
                // file written successfully
            } catch (err) {
                console.error(err);
            }
            return res.status(200).send("ok");
        }

        if (lang === 'python') {
            fs.writeFileSync(__dirname + `/../public/views/pro_${id}.py`, code);
            PythonShell.run(__dirname + `/../public/views/pro_${id}.py`, [], function (err, data) {
                let html = '';
                if (err) {
                    html = `
                    <!DOCTYPE html>
                        <html lang="en">
                            <body>
                                <pre>${err}</pre>
                            </body>
                        </html>
                `;
                    fs.writeFileSync(__dirname + `/../public/views/pro_${id}.html`, html);
                    return res.status(200).send("ok");

                } else {
                    let dt = ''
                    data.map(e => dt += e + "\n");
                    html = `
                    <!DOCTYPE html>
                        <html lang="en">
                            <body>
                                <pre>${dt}</pre>
                            </body>
                        </html>
                `;
                    fs.writeFileSync(__dirname + `/../public/views/pro_${id}.html`, html);
                    return res.status(200).send("ok");
                }
            });
        }
    })
}