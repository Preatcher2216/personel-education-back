const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, Role, Position, Competence } = require('../models/models')
const ApiError = require('../error/ApiError')

const generateJwt = (id, email, roleRang) => {
    return jwt.sign({ id, email, roleRang },
        process.env.SECRET_KEY,
        { expiresIn: '24h' })
}

const ExcelJS = require("exceljs");
const fs = require('fs');


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

function generateXLS(data) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Отчет развития компетенций сотрудников", {
            pageSetup: { paperSize: 9, orientation: "landscape" },
        });

        // Initialize the row index
        let rowIndex = 2;

        let row = worksheet.getRow(rowIndex);
        row.values = ["ФИО", "Должность", "Освоение компетенций"];
        row.font = { bold: true };

        const columnWidths = [20, 20, 20];

        row.eachCell((cell, colNumber) => {
            const columnIndex = colNumber - 1;
            const columnWidth = columnWidths[columnIndex];
            worksheet.getColumn(colNumber).width = columnWidth;
        });

        // Loop over the grouped data
        data.forEach((task, index) => {
            const row = worksheet.getRow(rowIndex + index + 1);
            row.getCell("A").value = task.fio;
            row.getCell("B").value = task.grade;
            row.getCell("C").value = task.progress;

            row.getCell("B").alignment = { wrapText: true };
        });
        // Increment the row index
        rowIndex += data.length;

        // Merge cells for the logo
        worksheet.mergeCells(
            `A1:${String.fromCharCode(65 + worksheet.columns.length - 1)}1`
        );

        // const image = workbook.addImage({
        //     base64: LOGO_64, //replace it your image (base 64 in this case)
        //     extension: "png",
        // });

        // worksheet.addImage(image, {
        //     tl: { col: 0, row: 0 },
        //     ext: { width: 60, height: 40 },
        // });

        worksheet.getRow(1).height = 40;


        // Define the border style
        const borderStyle = {
            style: "thin", // You can use 'thin', 'medium', 'thick', or other valid styles
            color: { argb: "00000000" },
        };

        // Loop through all cells and apply the border style
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.border = {
                    top: borderStyle,
                    bottom: borderStyle,
                };
            });
        });

        // Generate the XLS file
        return workbook.xlsx.writeBuffer();
    } catch (err) {
        console.log(err);
    }
}

const jsonToExel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Personel');

    // Заголовки столбцов
    worksheet.columns = [
        { header: 'FIO', key: 'fio', width: 30 },
        { header: 'Grade', key: 'grade', width: 20 },
        { header: 'Competetion complete', key: 'progress', width: 20 }
    ];

    // Добавление данных
    data.forEach((item) => {
        worksheet.addRow({
            fio: item.fio,
            grade: item.grade,
            progress: item.progress
        });
    });

    const file = await workbook.xlsx.writeFile(outputPath);
    return file
}

function generatePDF(data, outputPath = './output.pdf') {
    const doc = new PDFDocument();

    // Устанавливаем путь для сохранения PDF
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Добавляем данные в PDF
    doc.fontSize(12).text('ФИО\t\t\tДолжность\t\tОсвоение компетенций', { bold: true });
    data.forEach(item => {
        doc.fontSize(12).text(`${item.fio}\t\t\t${item.grade}\t\t\t${item.progress}`);
    });

    // Завершаем создание PDF
    doc.end();
}

class UserController {
    async getUser(req, res, next) {
        return next(ApiError.badRequest('error'))
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
        const token = generateJwt(user.id, email, role.rang)

        return res.json({ token })
    }
    async updateUser(req, res) { }
    async deleteUser(req, res) { }

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
        const token = generateJwt(user.id, user.email, role.rang)

        return res.json({ token })

    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
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

                // const xlsBuffer = await generateXLS(preparedUsers);
                console.log('work')
                await generateExcel(preparedUsers, filePath);
                console.log('work 0.5')


                // const xlsBuffer = await jsonToExel(preparedUsers);
                // res.set("Content-Disposition", "attachment; filename=data.xlsx");
                // res.type("application/vnd.ms-excel");
                // res.send(xlsBuffer);
                console.log('work 0.6')
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                console.log('work 0.7')
                // res.set("Content-Disposition", "attachment; filename=Сотрудники.xlsx");
                // res.setHeader('Content-Disposition', 'attachment; filename="Сотрудники.xlsx"');
                res.setHeader('Content-Disposition', 'attachment; filename="filename.xlsx"');
                console.log('work1')
                // Отправка файла
                const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
                console.log('work2')
                console.log('res', res)
                stream.pipe(res);
            }
        } catch (err) {
            res.json("Something went wrong");
        }
    }
}

module.exports = new UserController()