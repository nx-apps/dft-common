exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    r.db('common').table("bank")
        .merge(function (row) {
            return {
                bank_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .without('id')
        .orderBy(orderby || 'bank_name_th')
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
    r.db('common').table("bank")
        .get(req.params.bank_id)
        .merge(function (row) {
            return {
                bank_id: row('id'),
                date_created: row('date_created').toISO8601().split('T')(0),
                date_updated: row('date_updated').toISO8601().split('T')(0)
            }
        })
        .without('id')
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
exports.insert = function (req, res) {
    var valid = req.ajv.validate('common.bank', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body, {
            creater: 'admin',
            date_created: r.now().inTimezone('+07'),
            date_updated: r.now().inTimezone('+07')
        });
        r.db("common").table("bank")
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
        r.db("common").table("bank")
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
        r.db('common').table('bank')
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