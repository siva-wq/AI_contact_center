const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")


//authentication
router.post("/signup",authController.createUser)

router.post("/login",authController.LoginUser)

router.post("/getuser",authController.getUser)

router.get('/getallusers',authController.getAllUsers)

router.post('/forgotpass',authController.forgotpass)

module.exports=router;