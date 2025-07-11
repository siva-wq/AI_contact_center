const express=require("express")
const router=express.Router()
const authController=require("../controllers/authController")


router.get("/getuserissue",authController.getIssue)

router.get("/getallissues",authController.getAllIssues)

module.exports=router;