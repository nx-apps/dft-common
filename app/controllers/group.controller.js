exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    r.db('common').table("group")
        .merge(function (row) {
            return {
                group_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .without('id')
        .orderBy(orderby || 'group_name_th')
        .run()
        .then(function (result) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result)
        })
        .error(function (err) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(err)
        })
}
exports.getById = function (req, res) {
    var r = req.r;
    r.db('common').table("group")
        .get(req.params.group_id)
        .merge(function (row) {
            return {
                group_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        // .without('id')
        .run()
        .then(function (result) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result)
        })
        .error(function (err) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(err)
        })
}
exports.listtable = function (req, res) {
    var r = req.r;
    let table = [
        { table: "bank" },
        { table: "buyer" },
        // { table: "carrier"},
        { table: "continent" },
        { table: "country" },
        { table: "hamonize" },
        { table: "incoterms" },
        { table: "notify_party" },
        { table: "package" },
        { table: "port" },
        // { table: "province"},
        { table: "ship" },
        { table: "license_type"},
        { table: "surveyor" },
    ]
    // r.db('common').table("group")
    r.expr(table)
        .merge((item) => {
            return {
                field: r.db('common').table(item('table'))(0).keys()
            }
        })
        .run()
        .then(function (result) {
            let data = [],
                sub = []
            for (var index = 0; index < result.length; index++) {

                // console.log(result[index].table);
                for (var index2 = 0; index2 < result[index].field.length; index2++) {
                    // console.log(result[index].field[index2]);
                    sub.push({ id: result[index].field[index2] })
                }
                data.push({ table: result[index].table, sub: sub })
                sub = []
            }
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(data)
        })
        .error(function (err) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(err)
        })
}
exports.insert = function (req, res) {
    // var valid = req.ajv.validate('common.group', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    // if (valid) {
    req.body = Object.assign(req.body, {
        creater: 'admin',
        date_created: r.now().inTimezone('+07'),
        date_updated: r.now().inTimezone('+07')
    });
    r.db("common").table("group")
        .insert(req.body)
        .run()
        .then(function (response) {
            result.message = response;
            if (response.errors == 0) {
                result.result = true;
                result.id = response.generated_keys;
            }
            res.json(result);
        })
        .error(function (err) {
            result.message = err;
            res.json(result);
        })
    // } else {
    //     result.message = req.ajv.errorsText()
    //     res.json(result);
    // }
}
exports.update = function (req, res) {
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (req.body.id != '' && req.body.id != null && typeof req.body.id != 'undefined') {
        result.id = req.body.id;
        req.body = Object.assign(req.body, {
            updater: 'admin',
            date_updated: r.now().inTimezone('+07')
        });
        r.db("common").table("group")
            .get(req.body.id)
            .update(req.body)
            .run()
            .then(function (response) {
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                }
                res.json(result);
            })
            .error(function (err) {
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = 'require field id';
        res.json(result);
    }
}
exports.delete = function (req, res) {
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (req.params.id != '' || req.params.id != null) {
        result.id = req.params.id;
        r.db('common').table('groupitem').getAll(req.params.id, { index: 'group_id' }).delete()
            .merge((item) => {
                return r.db('common').table('group').get(req.params.id).delete()
            })
            .run()
            .then(function (response) {
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                }
                res.json(result);
            })
            .error(function (err) {
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = 'require field id';
        res.json(result);
    }
}

exports.importData = function (req, res) {
    req.jdbc.query('mssql', `
        select a.*,b.rice_id from Groups_Rice a
        left join Rice_in_Group b on a.ricegroup_id = b.ricegroup_id
        order by a.ricegroup_id,b.rice_id
    `,
        [],
        function (err, data) {
            data = JSON.parse(data);
            data = r.expr(data)
                .group('RiceGroup_id')
                .ungroup()
                .map(function (m) {
                    return {
                        creater: 'admin',
                        updater: 'admin',
                        date_created: r.now().inTimezone('+07'),
                        date_updated: r.now().inTimezone('+07'),
                        table_name: 'hamonize',
                        group_id: '1a324474-0940-4aa9-b4fd-0b98b9e4ce5c',
                        name_en: m('reduction')(0)('RiceGroup_name_en'),
                        name_th: m('reduction')(0)('RiceGroup_name_th'),
                        sub: m('reduction')
                            .map(function (m2) {
                                return r.db('common').table('hamonize')
                                    .filter({ hamonize_code: m2('rice_id') })
                                    .getField('id')
                                    .coerceTo('array')
                            })
                            .reduce(function (left, right) {
                                return left.add(right)
                            })
                            .map(function (m2) {
                                return { sub_id: m2 }
                            })
                    }
                });
                // r.db('common').table('groupitem').insert(data)
                data
                .run().then(function (data) {
                    res.json(data);
                })

        });
}