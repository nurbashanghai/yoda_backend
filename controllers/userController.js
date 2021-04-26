let ApiError = require('../error/ApiError');
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let {User, Mentor} = require('../models/models')
let uuid = require('uuid');
let path = require('path');
const { Op } = require('sequelize');
require('dotenv').config()

let generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        let {email, password, role, avatar} = req.body;
        // let {img} = req.files;
        // let fileName = uuid.v4() + ".jpg"; // for img files
        // img.mv(path.resolve(__dirname, '..', 'static', fileName))
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        let candidate = await User.findOne({where: {email}})
        let mentorCandidate = await Mentor.findOne({where: {email}})
        if (candidate || mentorCandidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        if(req.body.mentor === true){
            let hashPassword = await bcrypt.hash(password, 5)
            let user = await Mentor.create({email, role, password: hashPassword, avatar})
            let token = generateJwt(user.id, user.email, user.role)
            return res.json({user, access_token: token})
        } else {
            let hashPassword = await bcrypt.hash(password, 5)
            let user = await User.create({email, role, password: hashPassword, avatar})
            let token = generateJwt(user.id, user.email, user.role)
            return res.json({user, access_token: token})
        }
    }

    async patchUser(req, res){
        User.update(
            {interests: req.body.interests},
            {returning: true, where: {id: req.body.id}}
        ).then(function(rowsUpdate, [updatedUser]){
            res.json(updatedUser)
        }).catch(err => console.log(err, ' error here'))
    }

    async patchMentorSkills(req, res){
        console.log(req.body)
        Mentor.update(
            {skills: req.body.skills},
            {returning: true, where: {id: req.body.id}}
        ).then(function(rowsUpdate, [updatedUser]){
            res.json(updatedUser)
        }).catch(err => console.log(err, ' error here'))
    }

    async addInfo(req, res){
        console.log(req.body);
        User.update(
            {
                name: req.body.name,
                lastName: req.body.lastName,
                birthday: req.body.birthday
            },
            {returning: true, where: {id: req.body.id}}
        ).then(function(rowsUpdate, [updatedUser]){
            res.json(updatedUser)
        }).catch(err => console.log(err, ' error here'))
    }

    async verifyUser(req, res){

        let {access_token} = req.headers;

            let { email } = jwt.verify(access_token, process.env.SECRET_KEY);
            let user = await User.findOne({where: {email: email}});
            if(!user) {
                user = await Mentor.findOne({where: {email: email}});
            }

            if(!user){
                res.sendStatus(401);
            } else {
                res.send({user, access_token})
            }
    }

    async getMentors(req, res){
        console.log(req)
        let {interests} = req.query;
        let mentors = [];

        await Mentor.findAll({where:{
            skills: { [Op.contains]: [`${interests}`] }
        }}).then(function(assets){
            mentors = [...mentors,...assets];
        });

        console.log(mentors);
        if(mentors.length > 0){
            return res.send(mentors);
        } else {
            return res.sendStatus(404);
        }
    }

    async login(req, res, next) {
        let {email, password} = req.body.data
        if(email === process.env.ADMIN && password === process.env.PASSWORD){
            let user = await User.findOne({where: {email}})
            user.admin = true;
            let access_token = generateJwt(user.id, user.email, user.role)
            console.log(email)
            return res.json({user, access_token})
        }

        let user = await User.findOne({where: {email}})

        if (!user) {
            return res.status(400).send([{
                type: 'email',
                message: 'This email does not exist or already been used.'}])
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return res.status(400).send([{
                type: 'password',
                message: 'Wrong password.'}])
        }
        let access_token = generateJwt(user.id, user.email, user.role)
        return res.json({user , access_token})
    }

    async loginMentor(req, res, next) {
        let {email, password} = req.body.data
        let user = await Mentor.findOne({where: {email}})

        if (!user) {
            return res.status(400).send([{
                type: 'email',
                message: 'This email does not exist or already been used.'}])
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return res.status(400).send([{
                type: 'password',
                message: 'Wrong password.'}])
        }
        let access_token = generateJwt(user.id, user.email, user.role)
        return res.json({user , access_token})
    }

    async getAllMentors(req, res){

    }

    async check(req, res, next) {
        let token = generateJwt(req.user.id, req.user.email, req.user.role)
        if(!req.user.email){
            return res.sendStatus(401);
        }
        return res.json({token})
    }
}

module.exports = new UserController()
