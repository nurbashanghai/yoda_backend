const Router = require('express')
const OrderController = require('../controllers/OrderController')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const AdminController = require('../controllers/AdminController');

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/login/mentor', userController.loginMentor)
router.get('/auth', authMiddleware, userController.check)
router.get('/verify', userController.verifyUser)
router.put('/put', authMiddleware, userController.patchUser) // add interests
router.put('/put/skills', authMiddleware, userController.patchMentorSkills) // add interests
router.put('/update', authMiddleware, userController.addInfo) // add name lastname birthday
router.get('/getmentors', authMiddleware, userController.getMentors) // get array of mentors
router.post('/createorder', authMiddleware, OrderController.create)
router.get('/orders', authMiddleware, AdminController.getAll)

module.exports = router

// логика на создание ордера
// router.post('/', authMiddleware, orderController.create)

// const {mentorId, date} = req.body

// const user = req.user;

// {
//     mentorId,
//     date,
//     userId: user.id
// }
 
// include:[{model: Orders}]