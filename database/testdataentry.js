var database = require('./database.js');

var parser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
// need to add the drug list file

var fs = require('fs');
var names = ["mary", "coke"];
var patients = [];
var patientIds = [];
var lines;

//conecting to the database
mongoose.connect('mongodb://localhost/company', function(err) {
    if (err) console.log(err);
    else console.log("Connected to database!");
});

//for the API
var app = express(); // defines app as express for the code
// var router = express.Router ();  //allows you to access router, for multiple endpoints
app.use(parser.urlencoded({
    extended: true
})); //pass through parser
app.use(parser.json());

var router = express.Router();

//getting the database results
router.get('/results', function(req, res) {
    database.find({}).exec(function(err, results) {
        if (err) throw err;
        res.json(results);
    })
})

//get specific ressult
router.get('/results/:id', function(req, res) {
    database.findOne({id: req.params.id}).exec(function(err, results) {
        if (err) throw err;
        res.json(results);
    })
})


//delete all results
router.delete('/results/delete', function(req, res) {
    database.remove({}, function(err) {
        if (err) throw err;
        res.send('You have deleted all data in the database.');
    })

})

//I need to work on getting it to add
    fs.readFile('test.txt', 'utf8', function(err, data) {
        if (err) throw err;
        lines = data.split("\n");
        for (i = 0; i < lines.length; i++) {

            lines[i] = lines[i].replace('\n', '');
            var status = lines[i].split(" ");

            var patientDictionary = {};

            patientIds[i] = status[0];

            for (j = 1; j < status.length; j++) {
                patientDictionary[names[j - 1]] = status[j];
            }
            patients.push(patientDictionary); //add refined split elements
        }
        console.log(patients);
        for (i = 0; i < patients.length - 1; i++) {
            database.create({

                id: patientIds[i],
                test: patients[i],
            }, function(err, data) {
                if (err) throw err;
            });
        }
    });


app.use('/ko', router)
app.listen(3000);


// var drugThresh = [
//     test = null, // just a filler
//     thc = 10,
//     cocain = 300,
// ];

// function conclusion(ngml, thresh) {
//     if (ngml >= thresh) {
//         return "positive";
//     } else {
//         return "negative";
//     };
// };

// var testResults = {
//     //ngml  and the first var of conclusion will be pulled from a doc in the future
//     thc: {
//         ngml: 10,
//         conclusion: conclusion(10, drugThresh[1])
//     },
//     Cocain: {
//         ngml: 10,
//         conclusion: conclusion(10, drugThresh[2])
//     },
// }



// returns the desired entry in an object
// database.findOne({
//     patient_number: "number 1"
// }, function(err, result) {
//     if (err) throw err;
//     else console.log(result);
// })
