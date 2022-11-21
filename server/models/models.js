const sequelize = require('../db');

const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false, },
    password: {type: DataTypes.STRING, allowNull: false},
    fullName:{type: DataTypes.STRING, defaultValue: ""},
    bGrade: {type: DataTypes.STRING, defaultValue: ""},
    sGrade: {type: DataTypes.STRING, defaultValue: ""},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING, allowNull:false},
})

const RefrToken = sequelize.define("refrToken", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    token:{type: DataTypes.TEXT, allowNull: false, }
})

const Climb = sequelize.define("climb",{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    grade:  {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    attempts: {type: DataTypes.INTEGER, allowNull: false}
})

User.hasOne(RefrToken)
RefrToken.belongsTo(User)

User.hasMany(Climb)
Climb.belongsTo(User)

module.exports = {
    User,
    RefrToken,
    Climb
}