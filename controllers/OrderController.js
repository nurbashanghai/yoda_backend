const ApiError = require('../error/ApiError');
const {Order} = require('../models/models')


class OrderController {
    async create(req, res) {
        console.log(req.body)
        const {mentorId, date} = req.body
        const order = await Order.create({
            mentorId,
            date,
            userId: req.user.id
        })
        return res.sendStatus(201).json(order)
    }

}

module.exports = new OrderController()
