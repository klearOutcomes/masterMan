//files
var database = require('./database.js');
var admin = require('./admin.js');

var patient = database.patient;
var test = database.test;
var result = database.result;

//packages
var parser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var local = require('passport-local');


//conecting to the database
mongoose.connect('mongodb://localhost/company', function(err) {
    if (err) console.log(err);
    else console.log("Connected to database!");
});

//setting up the router
var app = express();
app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());
app.use(passport.initialize());
passport.use(admin.createStrategy());
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());

var router = express.Router();


router.post('/register', function(req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user) {
        if (err) {
            res.status(400).json({
                error: "Invalad Username"
            });
        } else {
            res.json({
                message: "Account created! Congrats, " + user.username
            });
        };
    });
});

router.post('/token', function(req, res) {
    User.findOne({
        username: req.body.username
    }).exec(function(err, user) {
        if (err) throw err;
        if (user == null) return res.status(400).json({
            error: "There is no user in my database like that"
        });

        jwt.sign({
                username: user.username,
                admin: user.admin,
            }, secret,
            function(err, token) {
                if (err) throw err;
                passport.authenticate('local')(req, res, function() {
                    return res.json({
                        token: token
                    });
                });
            });
    });
});

router.use(function(req, res, next) {
    var token = req.query.token || req.body.token || req.headers.authorization;
    if (token) {
        jwt.verify(token, secret, {}, function(err, payload) {
            if (err) {
                res.status(401).json({
                    error: "Invalid token"
                });
            } else {
                req.payload = payload;
                next();
            }
        })
    } else {
        res.status(401).json({
            error: "You need a token."
        });
    };
});

router.post('/result', function(req,res){
if (!req.payload.admin) return res.status(403).json({error: " NO. You are not allowed to do dis!!"})
  patient.create({
      patientId: order_number,
      
      time_made: new Date(),
  }

})
//get specific ressult
router.get('/result/:patientId', function(req, res) {
  if (!req.payload.admin) return res.status(403).json({error: " NO. You are not allowed to do dis!!"})
    if (!isNaN(req.params.patientId)) {
        patient.findOne({
            id: req.params.patientId
        }).exec(function(err, result)) {
            if (err) throw err;
            if (result == null) {
                return res.status(400) json({
                    error: "There is no ID like that in my database"
                });
            };
            res.json(result);
        };
    } else {
        res.status(400).json({
            error: "You did not provide a number"
        });
    };
});

//delete all results
router.delete('/result/delete/:patientId', function(req, res) {
  if (!req.payload.admin) return res.status(403).json({error: " NO. You are not allowed to do dis!!"})
  if (!isNaN(req.params.patientId)) {
      patient.remove({
          id: req.params.patientId
      }).exec(function(err, result)) {
          if (err) throw err;
          if (result == null) {
              return res.status(400) json({
                  error: "There is no ID like that in my database"
              });
          };
          res.json({message: "The entry has been deleted."});
      };
  } else {
      res.status(400).json({
          error: "You did not provide a number"
      });
  };
});

app.use('/ko', router)
app.listen(3000);
