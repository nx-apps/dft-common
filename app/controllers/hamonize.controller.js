exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    var countryGroup = req.query.group;
    if (typeof countryGroup === 'undefined') {
        countryGroup = r.db('common').table("type_rice")
    } else {
        countryGroup = r.db('common').table("type_rice")
            .getAll(countryGroup.toUpperCase(), { index: 'country_group' })
    }

    countryGroup.merge(function (row) {
        return {
            type_rice_id: row('id'),
            date_created: row('date_created').toISO8601().split('T')(0),
            date_updated: row('date_updated').toISO8601().split('T')(0),
        }
    })
        .without('id')
        .orderBy('type_rice_id')
        .run()
        .then(function (result) {
            res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result)
        })
        .error(function (err) {
            res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(err)
        })
}
exports.getById = function (req, res) {
    var r = req.r;
    r.db('common').table("type_rice")
        .get(req.params.type_rice_id)
        .merge(function (row) {
            return {
                type_rice_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .without('id')
        .run()
        .then(function (result) {
            res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result)
        })
        .error(function (err) {
            res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(err)
        })
}
exports.insert = function (req, res) {
    var valid = req.ajv.validate('common.hamonize', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body, {
            creater: 'admin',
            date_created: r.now().inTimezone('+07'),
            date_updated: r.now().inTimezone('+07'),
        });
        r.db("common").table("type_rice")
            .insert(req.body)
            .run()
            .then(function (response) {
                res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                    result.id = response.generated_keys;
                }
                res.json(result);
            })
            .error(function (err) {
                res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
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
        r.db("common").table("type_rice")
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
        r.db('common').table('type_rice')
            .get(req.params.id)
            .delete()
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
exports.toRethink = function (req, res) {
    var r = req.r;
    req.jdbc.query('mssql', 'select * from hamonize', []
        , function (err, data) {
            r.db('common').table('hamonize').insert(r.json(data))
                .run().then(function (data) {
                    res.json(data);
                })
        });
}
exports.toMssql = function (req, res) {
    var r = req.r;
    r.db('common').table('hamonize').filter({ digits: 14 })
        .run().then(function (data) {
            var sql = 'insert into hamonize (hamonize_code,hamonize_year,hamonize_th,digits) ';
            sql += '<br> values ';
            for (var i = 0; i < data.length; i++) {
                sql += "<br>('" + data[i].hamonize_code + "'," + data[i].hamonize_year + ",'" + data[i].hamonize_th + "'," + data[i].digits + ")";
                if (i < data.length - 1) {
                    sql += ',';
                }
            }
            res.send(sql);
        })
}