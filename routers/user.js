const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/Authentication");
const { suAuthorization } = require("../middlewares/Authorization");

const router = require("express").Router();

router.post("/login", UserController.login);

router.use(authentication);
router.post("/register", suAuthorization, UserController.register);

module.exports = router;
