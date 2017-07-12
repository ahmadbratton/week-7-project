const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

const trackerSchema = new Schema({
  activityid: {type: Number , required: true, unique: true},
  activity: String
});

const statSchema = new Schema({
  activity: String,
  statid:{type: Number , required: true},
  data: Number,
  dataType:String,
  date:{type:Date , default: Date.now()}
})

const userSchema = new Schema({
  Username:String,
  password:String
})






const activities = mongoose.model("activities",  trackerSchema);
const stats = mongoose.model("stats",  statSchema);
const user = mongoose.model("users", userSchema);

module.exports = {
  activities: activities,
  stats:stats,
  user: user};
