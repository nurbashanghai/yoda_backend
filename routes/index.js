const Router = require('express')
const router = new Router()
const routing = require('./router')

router.use('/user', routing)


module.exports = router