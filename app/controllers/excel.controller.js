exports.read = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../dft-common/files/port_g2g.xlsx');

    var file = workbook.Sheets;
    var data = {};
    var temp = { db: "", col: [], maxCol: "" };
    var keyIndex = 1; //num row has field_key
    var row = {};
    // res.json(file);
    for (var sheet in file) {
        for (var key in file[sheet]) {
            if (key !== '!ref' && key !== '!margins' && key !== '!autofilter') {
                if (str2NumOnly(key) == keyIndex) {
                    temp.col[str2CharOnly(key)] = file[sheet][key].v;
                    temp.maxCol = str2CharOnly(key);
                } else {
                    if (temp.col[str2CharOnly(key)].indexOf("date") > -1) {
                        row[temp.col[str2CharOnly(key)]] = req.r.ISO8601(file[sheet][key].w + "T00:00:00+07:00");
                    } else {
                        row[temp.col[str2CharOnly(key)]] = file[sheet][key].v;
                    }
                    if (str2CharOnly(key) == temp.maxCol) {
                        data[temp.db].push(row);
                        row = {};
                    }
                }

            } else {
                temp.col = [];
                temp.db = sheet;
                if (!data.hasOwnProperty(sheet)) {
                    data[sheet] = [];
                }
            }
        }
    }
    var dataSheet = [];
    for (table in data) {
        dataSheet.push({ table: table, data: data[table] });
    }

    // res.json(dataSheet);
    var r = req.r;
    r.expr(dataSheet).forEach(function (row) {
        return r.db('common').tableList().contains(row('table'))
            .do(function (tbExists) {
                return r.branch(tbExists,
                    r.db('common').table(row('table')).delete(),
                    r.db('common').tableCreate(row('table'))
                ).do(function (tbInsert) {
                    return r.db('common').table(row('table')).insert(row('data'))
                })
            })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
function str2NumOnly(string) { //input AB123  => output 123
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 48) && (string[i].charCodeAt(0) <= 57)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode(t);
}
function str2CharOnly(string) { //input AB123  => output AB
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 65) && (string[i].charCodeAt(0) <= 90)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode.apply(String, t);
}
exports.write = function (req, res) {
    req.r.db('common').table('hamonize').without('creater', 'updater', 'date_created', 'date_updated', 'id')
        .group('digits').ungroup()
        .run().then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            // /* create workbook & set props*/
            const wb = { SheetNames: [], Sheets: {} };
            // wb.Props = {
            //     Title: "Stats from app",
            //     Author: "John Doe"
            // };
            /*create sheet data & add to workbook*/
            for (var prop in data) {
                var ws = XLSX.utils.json_to_sheet(data[prop]['reduction']);
                var ws_name = 'hmcode' + data[prop]['group'];
                XLSX.utils.book_append_sheet(wb, ws, ws_name);
            }
            /* create file 'in memory' */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "myDataFile.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })

}