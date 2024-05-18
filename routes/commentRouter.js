const Router = require('express')
const router = new Router()

const commentController = require('../controllers/commentController')

router.get('/get-comment', commentController.getComment)
router.post('/create-comment', commentController.createComment)
router.post('/update-comment', commentController.updateComment)
router.delete('/delete-comment', commentController.deleteComment)

module.exports = router;