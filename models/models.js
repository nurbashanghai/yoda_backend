const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    interests: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
    birhtday: {type: DataTypes.STRING, defaultValue: "Define birthday"},
    name: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING, allowNull: false},
})

const Mentor = sequelize.define('mentors', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    skills: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
    birhtday: {type: DataTypes.STRING, defaultValue: "Define birthday"},
    name: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING, allowNull: false},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.STRING, allowNull: false}
})

User.hasMany(Order)
Order.belongsTo(User)

Mentor.hasMany(Order)
Order.belongsTo(Mentor)

module.exports = {
    User,
    Mentor,
    Order
}





