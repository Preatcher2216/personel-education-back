const { Competence } = require('../models/models')
const ApiError = require('../error/ApiError')

class CompetenceController {
    async createCompetence(req, res) {
        const { title,
            description,
            rate,
            rang,
            matrixId,
            competenceTypeId
        } = req.body

        const competence = await Competence.create({
            title,
            description,
            rate,
            rang,
            matrixId,
            competenceTypeId
        })

        return res.json(competence)
    }
    async getCompetence(req, res) {
        const {
            matrixId,
        } = req.query

        const competences = await Competence.findAll({ where: { matrixId } })

        return res.json(competences)
    }
    async getCompetences(req, res) {
        const competences = await Competence.findAll()

        return res.json(competences)
    }
    async updateCompetence(req, res) { }
    async deleteCompetence(req, res) { }
}

module.exports = new CompetenceController()