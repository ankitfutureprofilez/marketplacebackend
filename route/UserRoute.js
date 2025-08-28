const { UserAdd, login } = require("../controller/UserController");

const router =  require("express").Router();

router.post("/register" , UserAdd);
router.post("/login" , login);



module.exports = router ;
