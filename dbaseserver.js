/* variables declaration*/
var config = require('./config');
var dbClient = require('mongodb');
var bodyParser = require('body-parser');
var files = require('fs');
var express = require('express');
var app = express();

/*Connection string*/
var connectionStr;
var connectionStrString = 'mongodb://' + config.dbaseUser + ':' + config.dbasePassword + '@' + config.dbaseHost + ':' + config.dbasePort + '/' + config.database;

  /*Connecting to mlab mango databse */
  dbClient.connect(connectionStrString, function (err, database) {
    if (err) {
        console.log(err);
        return;
    }
	connectionStr = database;
	
	app.listen(3000, function () {
        console.log('Server listening on port 3000');
		
    });
	app.use(bodyParser.json());
    app.use('/city_logs_cqu', express.static('city_logs_cqu'));
    


	/*sending logs to server */
    app.post('/city/:city/log', function (request, response) {
        var city = request.params.city;
       console.log("in post");
		console.log(jsonString);
        var jsonString = JSON.stringify( request.body );
		files.appendFile('./logs/logs.dat', 'Posting city logs data to database: \n' + jsonString + "\n\n", function (error) {
            if (error) throw error;
        });

        connectionStr.collection(config.collection).insert( request.body, function (error, doc) {
        });
		response.send(request.body);
    });
	
	/* Getting city logs from database*/
    app.get('/city/search/:query', function (request, response) {
        var searchParam = request.params.query;
        connectionStr.collection(config.collection).find({city: searchParam}).toArray(function(error, results) {

            var jsonString = JSON.stringify(results);
            files.appendFile('./logs/logs.dat', 'Getting city logs for ' + searchParam + "\n" + jsonString + "\n\n", function (error) {
                if (error) throw error;
            });
			console.log(jsonString);
            response.json(results);
        });
    });

});