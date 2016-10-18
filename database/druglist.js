var mongoose = require('mongoose');

var fs = require('fs');

var names = ["mary","coke","alcohol","sam","stuff"];

var patients = [];
var lines;

fs.readFile('test.txt', 'utf8', function(err, data) {
	if (err) throw err;
	lines = data.split("$");
	for(i = 0; i < lines.length; i ++)
	{

		lines[i] = lines[i].replace('\n','');
		var status = lines[i].split(" ");

		var patientDictionary = {};

		patientDictionary["patientID"] = status[0];

		for(j = 1; j < status.length; j ++)
		{
			patientDictionary[names[j - 1]] = status[j];
		}
		patients.push(patientDictionary);//add refined split elements
	}


});
