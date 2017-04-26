exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    r.db('common').table("ship")
        .merge(function (row) {
            return {
                ship_id: row('id'),
                date_created: row('date_created').split('T')(0),
                date_updated: row('date_updated').split('T')(0)
            }
        })
        .without('id')
        .eqJoin("shipline_id", r.db('common').table("shipline")).without({ right: ["id", "date_created", "date_updated", "creater", "updater"] }).zip()
        .orderBy('shipline_name', 'ship_name')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .error(function (err) {
            res.json(err)
        })
}
exports.getById = function (req, res) {
    var r = req.r;
    r.db('common').table("ship")
        .get(req.params.id)
        .merge(
        {
            ship_id: r.row('id'),
            date_created: r.row('date_created').split('T')(0),
            date_updated: r.row('date_updated').split('T')(0)
        },
        r.db('common').table("shipline").get(r.row("shipline_id"))
        )
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
    var valid = req.ajv.validate('common.ship', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body, { 
            creater : 'admin',
            date_created : new Date().toISOString(),
            date_updated : new Date().toISOString(),
        });
        r.db("common").table("ship")
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
            updater : 'admin',
            date_updated : new Date().toISOString()
        });
        r.db("common").table("ship")
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
        r.db('common').table('ship')
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