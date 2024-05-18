const { Personel } = require('../models/models')
const ApiError = require('../error/ApiError')

class PersonelController {

    async createPersonel(req, res) {
        const { email,
            password,
            firstName,
            lastName,
            surName } = req.body

        const personel = await Personel.create({ email, password, firstName, lastName, surName })

        return res.json(personel)
    }
    async getPersonel(req, res) { }
    async getPersonels(req, res) {
        const personel = await Personel.findAll()

        return res.json(personel)
    }
}

module.exports = new PersonelController()