const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird")
mongoose.connect("mongodb://localhost:27017/dataTrack");

const trackerSchema = new Schema({
  activityid: {type: Number , required: true, unique: true},
  activity: String
});

const statSchema = new Schema({
  statid:{type: Number , required: true},
  data: Number,
  dataType:String,
  date:{type:Date , default: Date.now()}
})




const activities = mongoose.model("activities",  trackerSchema);
const stats = mongoose.model("stats",  statSchema);

let stationary;

router.get("/api/activities", function (req, res) {
  activities.find({}).then(function (activities) {
    if (activities) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(activities);
    }else {
      res.send("no activities found")
    }
  })

});

router.post("/api/activities", function (req, res) {
  let activity = new activities({
    activityid: req.body.activityid,
    activity: req.body.activity
  });

  activities.create(activity).then(function (activity) {
    if (activity) {
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(activity);
  }else {
    res.status(403).send("invalid activity")
  }
  })
});

router.get("/api/activities/:id", function (req, res) {
stats.find({statid:req.params.id}).then(function (activity) {
  if (activity) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(activity);
  }else {
    res.status(404).send("no activity")
  }
})
});

router.put("/api/activities/:id", function (req, res) {

  let updatedActivity = ({
    activity:req.body.activity
  });

  let updatedstat = ({
    dataType:req.body.dataType
  })

activities.update({activityid:req.params.id}, updatedActivity).then(function (activity) {
  if (activity) {

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(activity);
  }else {
    res.status(403).send("no activity found")
  }
})
stats.update({statid:req.params.id}, updatedstat).then(function (stat) {

});

});

router.delete("/api/activities/:id", function (req, res) {
activities.deleteOne({activityid:req.params.id}).then(function (deleted) {
  if (deleted) {
    res.status(200).send("activity delete");
  }else {
    res.status(404).send("no activity found");
  }
})
stats.deleteMany({statid:req.params.id}).then(function (deletedstats) {

})
});

router.post("/api/activities/:id/stats", function (req, res) {
  let dataActivity = new stats({
    statid:req.params.id,
    data: req.body.data,
    dataType:req.body.dataType
  })

    stats.create(dataActivity).then(function (data) {
      if (data) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json(data);
      }else {
        res.status(403).send("no activity found")
      }
    })


});


router.delete("/api/stats/:id", function (req, res) {
  stats.deleteOne({_id:req.params.id}).then(function (data) {
    if (data) {
      res.status(200).send("stat gone");
    }else {
      res.status(404).send("no object found");
    }
  })

});




module.exports = router;
