const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, Role, Position, Competence } = require('../models/models')
const ApiError = require('../error/ApiError')

const generateJwt = (id, email, roleRang,
    firstName,
    lastName,
    surName) => {
    return jwt.sign({
        id, email, roleRang, firstName,
        lastName,
        surName
    },
        process.env.SECRET_KEY,
        { expiresIn: '24h' })
}

const ExcelJS = require("exceljs");


async function generateExcel(data, outputPath = './Сотрудники.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Заголовки столбцов
    worksheet.columns = [
        { header: 'ФИО', key: 'fio', width: 30 },
        { header: 'Должность', key: 'grade', width: 20 },
        { header: 'Освоение компетенций', key: 'progress', width: 20 }
    ];

    // Добавление данных
    data.forEach((item) => {
        worksheet.addRow({
            fio: item.fio,
            grade: item.grade,
            progress: item.progress
        });
    });

    // Сохранение файла
    await workbook.xlsx.writeFile(outputPath);
}


class UserController {
    async getUser(req, res, next) {
        const {
            id,
        } = req.query

        const user = await User.findOne({ where: { id } })

        return res.json({ user })
    }
    async getUsers(req, res, next) {
        const users = await User.findAll()

        return res.json({ users })
    }
    async searchUser(req, res) { }
    async createUser(req, res, next) {
        const { email,
            password,
            firstName,
            lastName,
            surName,
            avatar,
            personelId,
            positionId,
            roleId,
            matrixId,
        } = req.body

        const candidate = await User.findOne({ where: { email } })

        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({ email, password: hashPassword, firstName, lastName, surName, avatar, personelId, positionId, roleId, matrixId })
        const role = await Role.findOne({ where: { id: user.roleId } })
        const token = generateJwt(user.id, email, role.rang, user.firstName, user.lastName, user.surName)

        return res.json({ user, token })
    }
    async updateUser(req, res) {
        const { id,
            positionId,
        } = req.body

        const user = await User.update({ positionId }, { where: { id } })


        return res.json(user)
    }

    async deleteUser(req, res) {
        const {
            id,
        } = req.query

        const user = User.destroy({ where: { id } })
        return res.json(user)
    }

    async login(req, res, next) {
        const { email,
            password,
        } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }

        let comparePass = bcrypt.compareSync(password, user.password)

        if (!comparePass) {
            return next(ApiError.badRequest('Неверно указан логин или пароль'))
        }
        const role = await Role.findOne({ where: { id: user.roleId } })
        const token = generateJwt(user.id, user.email, role.rang, user.firstName, user.lastName, user.surName)

        return res.json({ token })

    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.firstName, req.user.lastName, req.user.surName)
        return res.json({ token })
    }



    async generadeManagerReport(req, res) {
        try {
            const users = await User.findAll()

            const positions = await Position.findAll()

            const matrixIds = users.map(u => u.matrixId)

            const [competencesPromise] = await Promise.all([matrixIds.map(matrixId => Competence.findAll({ where: { matrixId } }))])
            const competences = await Promise.all(competencesPromise)

            const prepareCompetence = competences.reduce((acc, cur) => {
                let completeCount = 0;

                cur.forEach((competence) => {
                    if (competence.rate >= 4) {
                        completeCount++;
                    }
                });

                const prepare = {
                    id: cur[0].matrixId,
                    completePersent: (completeCount / cur.length) * 100,
                };

                acc.push(prepare);

                return acc;
            }, []);

            const positionsMap = new Map(positions.map((p) => [p.id, p]));
            const competenceMap = new Map(prepareCompetence.map((c) => [c.id, c]));

            const preparedUsers = users.map((u) => {
                return {
                    id: u.id,
                    fio: `${u.firstName} ${u.lastName} ${u.surName}`,
                    grade: positionsMap.get(u.positionId).title,
                    progress: competenceMap.get(u.matrixId).completePersent,
                };
            });

            if (preparedUsers.length > 0) {

                const filePath = './static/Personel.xlsx'

                await generateExcel(preparedUsers, filePath);


                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="filename.xlsx"');
                // Отправка файла
                return res.json({ message: 'success' })

            }
        } catch (err) {
            res.json("Something went wrong");
        }
    }
}

module.exports = new UserController()