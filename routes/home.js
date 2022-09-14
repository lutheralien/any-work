const express = require('express')
const homeController = require('../controllers/home')

const router = express.Router()

router.get('/', homeController.getHomePage)
router.get('/services', homeController.getServices)
router.get('/blog', homeController.getBlog)
router.get('/live-chat', homeController.getLiveChat)
router.get('/register', homeController.getRegisterPage)
router.get('/help', homeController.getHelp)

module.exports = router
