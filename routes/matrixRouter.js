const Router = require('express')
const router = new Router()

const matrixController = require('../controllers/matrixController')

const workFn = (req, res) => {
    res.json({ message: 'good' })
}

router.get('/get-matrix', matrixController.getMatrix)
router.post('/create-matrix', matrixController.createMatrix)
router.delete('/delete-matrix', matrixController.deleteMatrix )

module.exports = router