const { Comment } = require('../models/models')

class CommentController {
    async getComment(req, res) {
        const {
            competenceId,
        } = req.query

        const comment = await Comment.findAll({ where: { competenceId } })

        return res.json(comment)
    }
    async createComment(req, res) {
        const {
            comment,
            competenceId,
            change_date
        } = req.body

        const newComment = await Comment.create({ comment, competenceId, change_date })

        return res.json(newComment)
    }
    async updateComment(req, res) { }
    async deleteComment(req, res) { }
}

module.exports = new CommentController()