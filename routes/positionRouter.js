const Router = require('express')
const router = new Router()

const positionController = require('../controllers/positionController')

router.get('/get-position', positionController.getPosition)
router.get('/get-positions', positionController.getPositions)
router.post('/create-position', positionController.createPosition)

module.exports = router