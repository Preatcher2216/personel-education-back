const Router = require('express')
const router = new Router()

const commentRouter = require('./commentRouter')
const competenceRouter = require('./competenceRouter')
const competenceTypeRouter = require('./competenceType')
const matrixRouter = require('./matrixRouter')
const personelRouter = require('./personelRouter')
const positionRouter = require('./positionRouter')
const roleRouter = require('./roleRouter')
const userRouter = require('./userRouter')

router.use('/personel', personelRouter)
router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/position', positionRouter)
router.use('/matrix', matrixRouter)
router.use('/competence', competenceRouter)
router.use('/competence-type', competenceTypeRouter)
router.use('/comment', commentRouter)

module.exports = router