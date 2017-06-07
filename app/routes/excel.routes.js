module.exports = function (app) {
    var controller = require('../controllers/excel.controller');
    app.route('/read').get(controller.read);
    app.get('/write', controller.write);
}