const Router = require("express").Router;
const userController = require("../controller/user-controller");
const router = new Router();
const {body} = require("express-validator")
const authMiddleware = require("../middlewares/auth-middleware");
const climbController = require("../controller/climb-controller");

router.post('/registration', 
body("email").isEmail(),
body("password").isLength({min: 3, max: 32}),
userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh',userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)//доступен только для авторизованных юзеров
router.post("/create-climb", authMiddleware, climbController.createClimb)//доступен только для авторизованных юзеров
router.delete("/delete/:id", authMiddleware, climbController.deleteClimb)//доступен только для авторизованных юзеров
router.get('/climbs', authMiddleware, climbController.getClimbs) //доступен только для авторизованных юзеров


module.exports = router;


