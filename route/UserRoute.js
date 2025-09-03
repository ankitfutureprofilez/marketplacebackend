const { UserAdd, login, GetUser, SendOtp, VerifyOtp } = require("../controller/UserController");

const router = require("express").Router();

router.post("/user/register", UserAdd);
router.post("/user/login", login);
router.get("/user/get-user", GetUser);
router.post("/user/send-otp", SendOtp);
router.post("/user/verify-otp", VerifyOtp);

module.exports = router;