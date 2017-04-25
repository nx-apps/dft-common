exports.list = function (req, res) {
    var r = req.r;
    var orderby = req.query.orderby;
    r.db('common').table("shipline")
        .merge(function (row) {
            return {
                shipline_id: row('id'),
                date_created: row('date_created').split('T')(0),
                date_updated: row('date_updated').split('T')(0)
            }
        })
        .without('id')
        .orderBy('shipline_name')
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
    r.db('common').table("shipline")
        .get(req.params.id)
        .merge(
        {
            shipline_id: r.row('id'),
            date_created: r.row('date_created').split('T')(0),
            date_updated: r.row('date_updated').split('T')(0)
        }
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
exports.ship = function (req, res) {
    var r = req.r;
    r.db('common').table("shipline")
        .merge(function (row) {
            return {
                shipline_id: row('id'),
                date_created: row('date_created').split('T')(0),
                date_updated: row('date_updated').split('T')(0)
            }
        })
        .map(function (m) {
            return m.merge(function (me) {
                return {
                    ship: r.db('common').table('ship')
                        .getAll(me('shipline_id'), { index: 'shipline_id' })
                        .merge(function (p) {
                            return {
                                ship_id: p('id')
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
    var valid = req.ajv.validate('common.shipline', req.body);
    var r = req.r;
    var result = { result: false, message: null, id: null };
    if (valid) {
        r.db("common").table("shipline")
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
        r.db("common").table("shipline")
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
        r.db('common').table('shipline')
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