const { Matrix } = require('../models/models')
const ApiError = require('../error/ApiError')

class MatrixController {
    async getMatrix(req, res) {
        const {
            id,
        } = req.query

        const position = await Matrix.findOne({ where: { id } })

        return res.json(position)
    }
    async createMatrix(req, res) {
        const { competenceCount,
        } = req.body

        const matrix = await Matrix.create({ competenceCount })

        return res.json(matrix)
    }
    async deleteMatrix(req, res) { }
}

module.exports = new MatrixController()