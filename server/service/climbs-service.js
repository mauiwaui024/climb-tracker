const ApiError = require("../exceptions/api-error")
const {Climb} = require("../models/models")

class ClimbService{
    async createClimb(userId, grade, description, attempts){
        const climb = await Climb.create({userId, grade, description, attempts})
        return climb
    }

    async getClimbsOfUser(userId){
        const climbs = await Climb.findAll({where:{userId:userId}})
        return climbs;
    }

    async deleteClimb(id, userId){
        const climb = await Climb.findOne({where:{id, userId}})
        if(!climb){
            throw ApiError.BadRequest("Задачи с таким айди отсутсвует")
        }
        await climb.destroy()
        return climb;
    }
}

module.exports = new ClimbService()