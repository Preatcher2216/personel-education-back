const Router = require('express')
const router = new Router()

const competenceController = require('../controllers/competenceController')

router.get('/get-competence', competenceController.getCompetence)
router.get('/get-competences', competenceController.getCompetences)
router.post('/create-competence', competenceController.createCompetence)
router.post('/update-competence', competenceController.updateCompetence)
router.delete('/delete-competence', competenceController.deleteCompetence)

module.exports = router;