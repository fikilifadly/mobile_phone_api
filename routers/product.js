const ProductController = require("../controllers/ProductController");
const authentication = require("../middlewares/Authentication");

const router = require("express").Router();

router.use(authentication);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
