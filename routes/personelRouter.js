const Router = require('express')
const router = new Router()

const personelController = require('../controllers/personelController')

router.post('/create-personel', personelController.createPersonel)
router.get('/get-personel', personelController.getPersonel)
router.get('/get-personels', personelController.getPersonels)

module.exports = router