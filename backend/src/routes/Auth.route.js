const AuthController = require("../controllers/Auth.controller")
const Authentication = require("../middlewares/Authentication")
const Validation = require("../middlewares/Validation")
const AuthValidation = require("../validations/Auth.validation")

const router = require("express").Router()

router.post("/register", AuthController.RegisterUser)
router.post("/login", AuthController.LoginUser)
router.post("/profile",  AuthController.ProfileController)

module.exports = router