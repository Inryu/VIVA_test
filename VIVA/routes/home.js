var models = require('../models');
const express = require('express');
const router = express.Router();
var Op = models.Sequelize.Op;

/*
각 교재 정보 bookInfo(배열)로 넘어감
성공 status : success
실패 status : fail
가진 교재가 없을 때 status : null
*/

async function retrieveBook(workbooks, res) {
    if (workbooks.length != 0) { //교재 있냐?
        var bookInfo = new Array();
        for (var i in workbooks) {
            let temp = await models.workbook.findOne({
                where: {
                    workbook_sn: workbooks[i].dataValues.workbook_sn
                }
            });
            bookInfo.push(temp);
        }
        try {
            res.send({ //교재 정보 넘김
                message: "Retrieve books",
                status: 'success',
                data: {
                    bookInfo
                }
            });
        } catch (err) { //무언가 문제가 생김
            res.send({
                message: "ERROR",
                status: 'fail'
            })
        }
    }
    else { //교재 없거나 실패한 것임
        res.send({
            message: "Null or fail",
            status: 'null'
        });
    }
}

//Home
//localhost:3001/api/home?stu_id=samdol
router.get('/', async function (req, res, next) {
    const input_stu_id = req.query.stu_id;

    let result = await models.student.findOne({
        where: {
            stu_id: input_stu_id
        }
    });

    if (result) {
        //유저 정보
        const retrievedUser = {
            stu_nick: result.dataValues.stu_nick,
            stu_grade: result.dataValues.stu_grade,
            stu_photo: result.dataValues.stu_photo
        }
        res.send({
            message: "Retrieve data",
            status: 'success',
            data: {
                retrievedUser
            }
        });
    }
    else {
        res.status(500).send({
            message: "Retrieve fail"
        });
    }
});

//localhost:3001/api/home/workbook?stu_id=samdol
//localhost:3001/api/book-list/workbook?stu_id=samdol
router.get('/workbook', async function (req, res, next) {
    const input_stu_id = req.query.stu_id;

    let result = await models.student.findOne({
        where: {
            stu_id: input_stu_id
        }
    });

    //일반 교재만
    let workbooks = await models.stu_workbook.findAll({
        where: {
            stu_sn: result.dataValues.stu_sn,
            workbook_sn: {
                [Op.lt]: 1000000
            }
        }
    });

    retrieveBook(workbooks, res);
});

//localhost:3001/api/home/academy?stu_id=samdol
//localhost:3001/api/book-list/academy?stu_id=samdol
router.get('/academy', async function (req, res, next) {
    const input_stu_id = req.query.stu_id;

    let result = await models.student.findOne({
        where: {
            stu_id: input_stu_id
        }
    });

    //학원 교재만
    let workbooks = await models.stu_workbook.findAll({
        where: {
            stu_sn: result.dataValues.stu_sn,
            workbook_sn: {
                [Op.gt]: 999999
            }
        }
    });

    retrieveBook(workbooks, res);
});

//localhost:3001/api/home/incor-note?stu_id=samdol
//localhost:3001/api/book-list/incor-note?stu_id=samdol
router.get('/incor-note', async function (req, res, next) {
    const input_stu_id = req.query.stu_id;

    let result = await models.student.findOne({
        where: {
            stu_id: input_stu_id
        }
    });

    //오답노트만
    let bookInfo = await models.incor_note.findAll({
        where: {
            stu_sn: result.dataValues.stu_sn
        }
    });

    if (bookInfo.length != 0) {
        var pbCount = new Array();
        for(var i in bookInfo){
            var temp = await models.incor_problem.count({
                where: {
                    note_sn: bookInfo[i].dataValues.note_sn
                }
            });
            pbCount.push(temp);
        }
        try {
            res.send({ //교재 정보 넘김
                message: "Retrieve books",
                status: 'success',
                data: {
                    bookInfo,
                    pbCount
                }
            });
        } catch (err) { //무언가 문제가 생김
            res.send({
                message: "ERROR",
                status: 'fail'
            })
        }
    }
    else { //교재 없거나 실패한 것임
        res.send({
            message: "Null or fail",
            status: 'null'
        });
    }
});

module.exports = router;