const { Position } = require('../models/models')
const ApiError = require('../error/ApiError')

class PositionController {
    async createPosition(req, res) {
        const {
            title,
            rang = 0,
        } = req.body

        const position = await Position.create({ title, rang })

        return res.json(position)
    }
    async getPosition(req, res) {
        const {
            id,
        } = req.query

        const position = await Position.findOne({ where: { id } })

        return res.json(position)
    }
}

module.exports = new PositionController()