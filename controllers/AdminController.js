const {Order, User, Mentor} = require('../models/models')

class AdminController {

    async getAll(req, res) {
        const orders = await Order.findAll({
            include: [{
                model: User,
                required: true
            },
            {
                model: Mentor, // with two models join
                required: true
            }]
        }).then(data => res.send(data));

        return res.json(orders)
    }

}

module.exports = new AdminController()
