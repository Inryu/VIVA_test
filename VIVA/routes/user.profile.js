var models = require('../models');
const express = require('express');
const router = express.Router();
var Op = models.Sequelize.Op;

// Update userInfo
//localhost:3001/api/user/profile/samdol
router.put('/:stu_id', function (req, res, next) {
  const id = req.params.stu_id;
  let body = req.body;

  models.student.update({
    stu_nick: body.stu_nick,
    stu_grade: body.stu_grade,
    stu_photo: body.stu_photo
  }, {
    where: { stu_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "UserInfo was updated successfully.",
          status: 'success'
        });
      } else {
        res.send({
          message: "Data was not found or req.body is empty!",
          status: 'fail'
        });
      }
    })
    .catch(err => {
      res.send({
        message: "Error updating UserInfo",
        status: 'fail'
      });
      console.log(err);
    });
});

module.exports = router;