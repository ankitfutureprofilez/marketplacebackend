const { UserAdd, login, GetUser } = require("../controller/UserController");

const router = require("express").Router();

router.post("/register", UserAdd);
router.post("/login", login);
router.get("/get-user", GetUser);

module.exports = router;