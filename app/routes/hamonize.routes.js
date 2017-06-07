module.exports = function (app) {
    var controller = require('../controllers/hamonize.controller');
    app.get(['/', '/list'], controller.list);
    app.get('/id/:type_rice_id', controller.getById);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
    app.get('/toRethink', controller.toRethink);
    app.get('/toMssql',controller.toMssql);
}