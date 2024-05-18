const Router = require('express')
const router = new Router()

const roleController = require('../controllers/roleController')

router.get('/get-role', roleController.getRole)
router.get('/get-roles', roleController.getRoles)
router.post('/create-role', roleController.createRole)

module.exports = router