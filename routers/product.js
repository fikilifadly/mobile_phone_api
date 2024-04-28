const ProductController = require("../controllers/ProductController");
const authentication = require("../middlewares/Authentication");
const { ProductAuthorization } = require("../middlewares/Authorization");

const router = require("express").Router();

router.use(authentication);
router.get("/", ProductController.getAllProducts);
router.post("/", ProductController.createProduct);

router.get("/:id", ProductAuthorization, ProductController.getProductById);
router.patch("/:id", ProductAuthorization, ProductController.updateProduct);
router.delete("/:id", ProductAuthorization, ProductController.deleteProduct);

module.exports = router;
