const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")



router.post("/chat",authController.chat)

router.get("/getmsg/:userId",authController.getMsg)

router.get("/escalataed",authController.getescalated)

router.post("/removeescalataed/:userId",authController.removeescalataed)

//admin routes

router.post("/takeover",authController.TakeOver)

router.post("/saveMsg",authController.saveMsg)

router.get("/istakenover/:userId",authController.isTakenOVer)

module.exports=router;