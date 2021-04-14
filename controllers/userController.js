const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        
        // const resUser = await User.get()
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({user, access_token: token})
    }

    async verifyUser(req, res){

        const {access_token} = req.headers;

            const { id } = jwt.verify(access_token, process.env.SECRET_KEY);
            const user = await User.findOne({where: {id: id}});
            if(user === null){
                res.send('null')
            } else {
                res.send({user, access_token})
            }
        
    }

    async login(req, res, next) {
        console.log(req.body)
        const {email, password} = req.body.data
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const access_token = generateJwt(user.id, user.email, user.role)
        return res.json({user , access_token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()
