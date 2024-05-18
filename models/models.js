const sequelize = require('../ds')
const { DataTypes } = require('sequelize')

const Personel = sequelize.define('personel', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    surName: { type: DataTypes.STRING },
})

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    surName: { type: DataTypes.STRING },
    avatar: { type: DataTypes.BLOB }
})

const Position = sequelize.define('position', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    rang: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    rang: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Matrix = sequelize.define('matrix', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    competenceCount: { type: DataTypes.INTEGER, defaultValue: 0 }
})

const Competence = sequelize.define('competence', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    rate: { type: DataTypes.INTEGER },
    rang: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const CompetenceType = sequelize.define('competence_type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rang: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comment: { type: DataTypes.STRING },
    change_date: { type: DataTypes.DATE },
})

Personel.hasOne(User)
User.belongsTo(Personel)

Position.hasOne(User)
User.belongsTo(Position)

Role.hasOne(User)
User.belongsTo(Role)

Matrix.hasOne(User)
User.belongsTo(Matrix)

Matrix.hasMany(Competence)
Competence.belongsTo(Matrix)

Competence.hasMany(Comment)
Comment.belongsTo(Competence)

CompetenceType.hasOne(Competence)
Competence.belongsTo(CompetenceType)

module.exports = {
    Personel,
    User,
    Position,
    Role,
    Matrix,
    Competence,
    CompetenceType,
    Comment
}