//сервис для работы с токенами - crud и тд
const jwt = require("jsonwebtoken");
const {RefrToken} =require("../models/models");

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "5d"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "15d"})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await RefrToken.findOne({where:{userId}})///////
        if(tokenData){
           tokenData.token = refreshToken;
           await tokenData.save()
        } else
        {const token = RefrToken.create({userId, token:refreshToken})
        return token}
    }

    async removeToken(refreshToken){
        const tokenData = await RefrToken.findOne({where:{token:refreshToken}})
        await tokenData.destroy()
        console.log(tokenData);
        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = await RefrToken.findOne({where:{token:refreshToken}})
        console.log(tokenData);
        return tokenData
    }
}

module.exports = new TokenService()