const Router = require('express')
const router = new Router()

const competenceTypeController = require('../controllers/competenceTypeController')

router.get('/get-competence-type', competenceTypeController.getCompetenceType)
router.post('/create-competence-type', competenceTypeController.createCompetenceType)

module.exports = router;