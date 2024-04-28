const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/Authentication");

const router = require("express").Router();

router.post("/login", UserController.login);

router.use(authentication);
router.post("/register", UserController.register);

module.exports = router;
