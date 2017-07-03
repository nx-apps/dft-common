exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    r.db('common').table("country")
        .merge(function (row) {
            return {
                country_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .eqJoin('continent_id', r.db('common').table('continent')).pluck('left', { right: ['continent_name_en', 'continent_name_th'] }).zip()
        .without('id')
        .orderBy(orderby || 'country_id')
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
    r.db('common').table("country")
        .get(req.params.id)
        .merge(function (row) {
            return {
                country_id: row('id'),
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
exports.ports = function (req, res) {
    var r = req.r;
    r.db('common').table("country")
        .merge(function (row) {
            return {
                country_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .map(function (m) {
            return m.merge(function (me) {
                return {
                    port: r.db('common').table('port')
                        .getAll(me('country_id'), { index: 'country_id' })
                        .merge(function (p) {
                            return {
                                port_id: p('id')
                            }
                        })
                        .without('id', 'date_created', 'date_updated', 'creater', 'updater')
                        .coerceTo('array')
                }
            })
        })
        .without('id')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .error(function (err) {
            res.json(err)
        })
}
exports.insert = function (req, res) {
    var valid = req.ajv.validate('common.country', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body, {
            creater: 'admin',
            date_created: r.now().inTimezone('+07'),
            date_updated: r.now().inTimezone('+07'),
        });
        r.db("common").table("country")
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
        r.db("common").table("country")
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
        r.db('common').table('country')
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
exports.mssql = function (req, res) {
    var r = req.r;
    var j = req.jdbc;

    r.db('common').table('country')
        .without('creater', 'date_created', 'date_updated', 'id')
        .orderBy('country_code2')
        .run()
        .then(function (data) {
            var sql = 'insert into country (continent_id,country_code2,country_code3,country_fullname_en,country_fullname_th,country_name_en,country_name_th) ';
            sql += '<br> values ';
            for (var i = 0; i < data.length; i++) {
                sql += "<br>('" + data[i].continent_id + "','" + data[i].country_code2 + "','" + data[i].country_code3 + "','" + data[i].country_fullname_en + "','" + data[i].country_fullname_th + "','" + data[i].country_name_en + "','" + data[i].country_name_th + "')";
                if (i < data.length - 1) {
                    sql += ',';
                }
            }
            res.send(sql);
        })
}