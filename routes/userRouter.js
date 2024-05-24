const Router = require('express')
const router = new Router()

const userController = require('../controllers/userControllers')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/get-user', userController.getUser)
router.get('/get-users', userController.getUsers)
router.post('/search-user', userController.searchUser)
router.post('/create-user', userController.createUser)
router.post('/update-user', userController.updateUser)
router.delete('/delete-user', userController.deleteUser)

router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

router.post('/managerReport', userController.generadeManagerReport)

module.exports = router;   