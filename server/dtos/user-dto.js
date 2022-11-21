module.exports = class UserDto{
    email;
    id;
    isActivated;
    fullName;
    bGrade;
    sGrade;
    constructor(model){
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;   
        this.fullName = model.fullName;
        this.bGrade = model.bGrade;
        this.sGrade = model.sGrade;
    }
}