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

    async getCompetenceById(req, res) {
        const {
            id,
        } = req.query

        const competence = await Competence.findOne({ where: { id } })

        return res.json(competence)
    }
    async getCompetences(req, res) {
        const competences = await Competence.findAll()

        return res.json(competences)
    }
    async updateCompetence(req, res) {
        const {
            id,
            description,
            rate
        } = req.body

        const competence = await Competence.update({ description, rate }, { where: { id } })

        return res.json(competence)
    }
    async deleteCompetence(req, res) {
        const {
            id,
        } = req.query

        const competence = await Competence.destroy({ where: { id } })

        return res.json(competence)
    }
}

module.exports = new CompetenceController()