const climbService = require("../service/climbs-service");

class ClimbController{
    async createClimb(req,res,next){
        try {
            const {grade, description, attempts} = req.body;
            const climb = await climbService.createClimb(req.user.id, grade, description, attempts)
            return res.json(climb)
        } catch (e) {
            next(e)
        }
    }

    async getClimbs(req,res, next){
        try {
            const userId = req.user.id;
            const climbs = await climbService.getClimbsOfUser(userId);
            if(!climbs){
                return next(ApiError.BadRequest('Пролазы отсутсвуют'))
            }
            return res.json(climbs)
        } catch (e) {
            next(e)
        }
    }

    async deleteClimb(req,res, next){
        try {
            const userId = req.user.id;
            console.log(userId);
            const climbId = req.params.id;
            const climb = await climbService.deleteClimb(climbId, userId)
            return res.json(climb)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ClimbController();