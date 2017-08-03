exports.list = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        // .merge(function (row) {
        //     return {
        //         country_group_id: row('id'),
        //         // date_created: row('date_created').toISO8601().split('T')(0),
        //         // date_updated: row('date_updated').toISO8601().split('T')(0)
        //     }
        // })
        .without('country')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.getById = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        .get(req.params.id)
        // .merge(function (row) {
        //     return {
        //         country_group_id: row('id'),
        //         date_created: row('date_created').toISO8601().split('T')(0),
        //         date_updated: row('date_updated').toISO8601().split('T')(0)
        //     }
        // })
        .merge(function (m) {
            return {
                country: m('country').map(function (c_map) {
                    return r.db('common').table('country').get(c_map).without('date_created', 'date_updated')
                })
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.country = function (req, res) {
    var r = req.r;
    r.db('common').table('country')
        // .merge(function (row) {
        //     return {
        //         country_group_id: row('id'),
        //         date_created: row('date_created').toISO8601().split('T')(0),
        //         date_updated: row('date_updated').toISO8601().split('T')(0)
        //     }
        // })
        .filter(function (f) {
            return r.expr(
                r.db('common').table('country_group').get(req.params.id).getField('country')
            ).contains(f('id')).not()

        })
        .run()
        .then(function (result) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result);
        })
        .catch(function (err) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.status(500).json(err);
        })
}
exports.countries = function (req, res) {
    var r = req.r;
    r.db('common').table('country')
        // .merge(function (row) {
        //     return {
        //         country_group_id: row('id'),
        //         date_created: row('date_created').toISO8601().split('T')(0),
        //         date_updated: row('date_updated').toISO8601().split('T')(0)
        //     }
        // })
        .run()
        .then(function (result) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.json(result);
        })
        .catch(function (err) {
            //res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001');
            res.status(500).json(err);
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    req.body = Object.assign(req.body, {
        creater: 'admin',
        date_created: r.now().inTimezone('+07'),
        date_updated: r.now().inTimezone('+07'),
    });
    r.db('common').table('country_group')
        .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.update = function (req, res) {
    var r = req.r;
    req.body = Object.assign(req.body, {
        updater: 'admin',
        date_updated: r.now().inTimezone('+07')
    });
    r.db('common').table('country_group')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.delete = function (req, res) {
    var r = req.r;
    r.db('common').table('country_group')
        .get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
// exports.remove = function (req, res) {
//     var r = req.r;
//     r.db('common').table('country_group')
//         .get(req.body.id)
//         .update({ country: r.row('country').setDifference([req.body.country]) })
//         .run()
//         .then(function (result) {
//             res.json(result);
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }