//сервис для работы с пользователями - crud
const {User} = require("../models/models")
const bcrypt = require("bcrypt")
const mailService =require("./mail-service")
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto");
const uuid = require("uuid");
const ApiError = require("../exceptions/api-error");


class UserService{
    async registration(email, password){
        const candidate = await User.findOne({where:{email: email}}) // убеждаемся что неn такого юзера
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`)
        }
        const hashedPassword = await bcrypt.hash(password, 3)
        // console.log(hashedPassword);
        const activationLink = uuid.v4();
        const user = await User.create({email, password: hashedPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        
        const userDto = new UserDto(user) // email, id, isActivated
        const tokens = tokenService.generateTokens({...UserDto}) 

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens,
        user: userDto
        }
    }

    async activate(activationLink){
        const user = await User.findOne({where:{activationLink}})
        if(!user){
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        user.save();
    }
    async login(email, password){
        const user = await User.findOne({where:{email:email}})
        if(!user){
            throw ApiError.BadRequest('Пользователь не был найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens =  tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens,
        user: userDto
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token;
    }


    async refresh(refreshToken) {
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError("")
        }
        
        const user = await User.findOne({where:{id:userData.id}})
        const userDto = new UserDto(user)
        const tokens =  tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens,
        user: userDto
        }
    }

    async getAllUsers(){
        const users = await User.findAll();
        return users;
    }
}

module.exports = new UserService()