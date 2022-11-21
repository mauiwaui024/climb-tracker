// у нас есть список адресов в папке роутер, теперь необходимо сделать для каждого адреса
//функцию, которая будет вызывать по запросу на каждый адрес
//для каждого контроллера есть сервис еще ебать

const userService = require("../service/user-service")
const {validationResult} = require("express-validator")
const ApiError = require("../exceptions/api-error")


class UserController{
    async registration(req, res,next){
        try {
           //написали сервисы, в контроллере работаем с http составляющей
           const errors = validationResult(req)
           if(!errors.isEmpty()){
            return next(ApiError.BadRequest("Ошибка валидации", errors.array()))
           }
           const {email, password} = req.body;
           
           const userData = await userService.registration(email, password)
           console.log(userData);
           res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
           //помимо дб мы рефреш токен храним еще и в куках
           return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async login(req, res,next){
        try {
            const {email, password} = req.body;
            
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            //помимо дб мы рефреш токен храним еще и в куках
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res,next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }
    async activate(req, res, next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }
    async refresh(req, res,next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
   
    async getCurrent(req, res,next){
        try {
            
            console.log(req.user.id);
            const user = await userService.getCurrentUser(req.user.id);
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async updateCurrent(req, res, next){
        try {
            const {fullName, bGrade, sGrade} = req.body;
            const user = await userService.updateCurrentUser(req.user.id, fullName, bGrade, sGrade)
            return res.json(user)
        } catch (e) {
            next(e)
        } 
    }


}

module.exports = new UserController()