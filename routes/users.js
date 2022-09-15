const express = require('express')
const usersController = require('../controllers/users')
const { requireAuth, forwardAuth } = require('../middlewares/users')

const router = express.Router()

//post register users

router.post('/register', usersController.postRegister)

//get login Page
router.get('/login', forwardAuth, usersController.getLoginPage)
//post information
router.post('/login', usersController.postLoginPage)
//get dashboard
router.get('/dashboard', requireAuth, usersController.getUserDashboard)
//get Update Info Page
router.get('/update-info', requireAuth, usersController.getUpdateUserInformation)
//post information from update page
router.post('/update-info', requireAuth, usersController.postUpdateInformation  )
//post profile image from dashboard page
router.post('/profile-photo', requireAuth, usersController.postUpdateUserProfilePhoto)
//get photo library
router.get('/photo-library', requireAuth, usersController.getPhotoLibrary)
//post photo libary
router.post('/photo-library', requireAuth, usersController.postPhotoLibrary)
//get update photo library
router.get('/photo-library-update', requireAuth, usersController.getUpdatePhotoLibrary)
//edit page for photo
router.get('/photo-library-update/:id', requireAuth, usersController.getUpdatePhotoLibraryWithID)
//post update photo libary
router.post('/photo-library-update/:id', requireAuth, usersController.postUpdatePhotoLibraryWithID)
//user logout route
router.get('/logout', requireAuth, usersController.getUserLogOut)
//unauthorized route
router.get('/unauthorized', usersController.getError403)

module.exports = router
