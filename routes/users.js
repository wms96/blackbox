const router = require('express').Router();
const users = require('../controllers/users.js');


router.post('/register', 
  users.validate('register'), 
  function (req, res) {
  users.register(req, res) 
})

router.post('/login',
  users.validate('login'), 
  function (req, res) {
  users.login(req, res) 
})

router.get('/users',
  function (req, res) {
  users.users(req, res)
})

router.post('/jwtValidator', 
  function (req, res) {
  users.jwtValidator(req, res) 
})


router.post('/resetPassword',
  users.validate('resetPassword'),
  function (req, res) {
  users.resetPassword(req, res)
})

router.get('/getAuth',
  function (req, res) {
  users.getAuth(req, res)
})


module.exports = router
