const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator/check');
const {validationResult} = require('express-validator/check');

const saltRounds = bcrypt.genSaltSync(10);
const accountSid = 'ACffc2cd339005456702aef4862e4f52f6'; // Your Account SID from www.twilio.com/console
const authToken = 'f2ea12d9dd1c8033839f70872b949d7f';   // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

const connection = require('../config/database.js');
const users = require('./users.js');

const request = require('request');

var https = require('follow-redirects').https;
var fs = require('fs');
const userModel = require("../models/user");

module.exports.users = async (req, res) => {
    const array = ['61f538afdead0a55fcf797cc', '61f5567b0ac17839fe085d72', '61f5567b0ac17839fe085d72'];
    userModel.find({
        '_id': {$in: array}
    }, function (err, teamData) {
        if(err){
           return  res.status(500).send(err);
       }
       return  res.send(teamData);

    });

}

module.exports.register = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
    req.body.password = passwordHash;
    const user = new userModel(req.body);

    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    try {
        const users = await userModel.find({
            "email": req.body.email
        });

        if (users.length == 0) {
            res.json({status: 401, message: "username or password are incorrect"});
        }

        if (bcrypt.compareSync(req.body.password, users[0].password)) {
            let payload = {subject: req.body.email};
            // todo add to enviroment
            let token = jwt.sign(payload, 'sercret');
            console.log('12')
            res.json({status: 201, token: token, results: users});
        } else {
            res.json({status: 0, message: "username or password are incorrect"});
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

module.exports.jwtValidator = (req, res) => {
    user = req.headers.authorization.split(" ");;
    console.log('user ', user[1]);
   return  jwt.verify( user[1], 'sercret', function (err, decoded) {
       if(err){
           res.status(500).send(err);
       }
        return decoded.subject; // bar
    });
}

module.exports.resetPassword = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    user = req.body;

    let randomCode = Math.random().toString(36).substring(8);
    const hash = bcrypt.hashSync(randomCode, saltRounds);
    connection.query('UPDATE users SET password = ? WHERE phone_number = ?', [hash, user.phone_number], function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows > 0) {
            client.messages.create({
                body: 'Use the Following Code to reset your Password: ' + randomCode,
                from: '+15015005084',
                to: '+96171035881'
            }).then(() => {
                res.json({status: 1, message: "Reset Password Sent"})
            })
        } else {
            res.json({status: 0, message: "Reset Password failed"})
        }
    });
}


exports.validate = (method) => {
    switch (method) {
        case 'register': {
            return [
                body('first_name', "first name doesn't exists").exists(),
                body('last_name', "last name doesn't exists").exists(),
                body('email', "email doesn't exists").exists().isEmail(),
                body('phone_number', "phone number doesn't exists").exists(),
                body('password', "password doesn't exists").exists().isLength({min: 6}),
            ]
        }
        case 'login': {
            return [
                body('email', "phone number doesn't exists").exists(),
                body('password', "password doesn't exists").exists(),
            ]
        }
        case 'resetPassword': {
            return [
                body('phone_number', "phone number doesn't exists").exists(),
            ]
        }
    }
}