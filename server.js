var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost/store';

app.get('/users/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        if (err) {
            res.status(500).send({
                "message": "Internal Server Error"
            });
        };

        var collection = db.collection('users');

        collection.findOne({
            '_id': ObjectID(req.params.id)
        }, function(err, result) {

            if (err) {
                res.status(500).send({
                    "message": "Internal Server Error"
                });
            }
            else if (result === null) {
                res.status(404).send({
                    "msg": "404"
                });
            } else {
                res.status(200); //ok
                res.json(result);

            }

            db.close();

        });
    });
});


app.post('/users', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.insert(req.body, function(err, result) {

            res.status(201);
            res.location(/users/ + result.insertedIds.toString());

            res.json({
                "message": "user added"
            });
            db.close();

        });
    });
});

app.listen(3000);
