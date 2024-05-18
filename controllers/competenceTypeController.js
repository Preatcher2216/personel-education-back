const { CompetenceType } = require('../models/models')
const ApiError = require('../error/ApiError')

class CompetenceTypeController {
    async createCompetenceType(req, res) {
        const {
            rang = 0,
        } = req.body

        const competenceType = await CompetenceType.create({ rang })

        return res.json(competenceType)
    }
    async getCompetenceType(req, res) { }
}

module.exports = new CompetenceTypeController()