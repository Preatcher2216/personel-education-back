const { Role } = require('../models/models')
const ApiError = require('../error/ApiError')

class RoleController {
    async createRole(req, res) {
        const {
            title,
            rang = 0,
        } = req.body

        const role = await Role.create({ title, rang })

        return res.json(role)
    }
    async getRole(req, res) { }
    async getRoles(req, res) {
        const roles = await Role.findAll()

        return res.json(roles)
    }
}

module.exports = new RoleController()