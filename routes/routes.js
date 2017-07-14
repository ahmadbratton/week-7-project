const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const models = require('../models/activity');
const Schema = mongoose.Schema;
const passport = require("passport");
const BasicStrategy = require('passport-http').BasicStrategy;
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/dataTrack");
router.use( passport.authenticate('basic', {session: false}));


let name;

const users = {
  "ahmad" : "bratton"
};

passport.use(new BasicStrategy(
  function(username, password, done) {
    const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));




router.get("/api/activities",  function (req, res) {
  models.activities.find({}).then(function (activities) {
    if (activities) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(activities);
    }else {
      res.send("no activities found")
    }
  })

});

router.post("/api/activities", function (req, res) {
  let activity = new models.activities({
    activityid: req.body.activityid,
    activity: req.body.activity
  });

  models.activities.create(activity).then(function (activity) {
    if (activity) {
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(activity);
  }else {
    res.status(403).send("invalid activity")
  }
  })
});

router.get("/api/activities/:id", function (req, res) {
  models.stats.find({statid:req.params.id}).then(function (stats) {
    if (stats.length > 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(stats);
    }else {
      models.activities.find({activityid:req.params.id}).then(function (activity) {
        if (activity.length > 0) {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(activity);
        }else {
          res.send("no activities found")
        }

    })
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

models.activities.update({activityid:req.params.id}, updatedActivity).then(function (activity) {
  if (activity) {

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(activity);
  }else {
    res.status(403).send("no activity found")
  }
})
models.stats.update({statid:req.params.id}, updatedstat).then(function (stat) {

});

});

router.delete("/api/activities/:id", function (req, res) {
models.activities.deleteOne({activityid:req.params.id}).then(function (deleted) {
  if (deleted) {
    res.status(200).send("activity delete");
  }else {
    res.status(404).send("no activity found");
  }
})
models.stats.deleteMany({statid:req.params.id}).then(function (deletedstats) {

})
});

router.post("/api/activities/:id/stats",  function (req, res) {
  models.activities.findOne({activityid:req.params.id}).then(function (activity) {
      name = activity.activity

console.log(name);

  let dataActivity = new models.stats({
    activity: name,
    statid:req.params.id,
    data: req.body.data,
    dataType:req.body.dataType
  })

    models.stats.create(dataActivity).then(function (data) {
      if (data) {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json(data);
      }else {
        res.status(403).send("no activity found")
      }
    })
});

});


router.delete("/api/stats/:id", function (req, res) {
  models.stats.deleteOne({_id:req.params.id}).then(function (data) {
    if (data) {
      res.status(200).send("stat gone");
    }else {
      res.status(404).send("no object found");
    }
  })

});




module.exports = router;
