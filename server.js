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

app.get('/users/',function(req, res) {

        MongoClient.connect(url, function(err, db) {

            if (err) {
                res.status(500);
                res.json({
                    'error': 'Internal Server Error'
                });
            } else {
                var collection = db.collection('users');
                collection.find().toArray(function(err, result) {

                    if (err) {
                        res.status(500);
                        res.json({
                            'error': 'Internal Server Error'
                        });
                    } else {
                        res.status(200);
                        res.json(result);
                    }

                    db.close();
                });
            }
        });
    });



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


app.post('/users/', function(req, res) {

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

app.put('/users/:id',function(req, res) {
        MongoClient.connect(url, function(err, db) {

            var collection = db.collection('users');

            collection.update({
                '_id': ObjectID(req.params.id)
            }, {
                $set: req.body
            }, function(err, result) {
                // response to the browser
                res.status(201);
                res.location(/api/users/ + ObjectID(req.params.id));
                res.json({
                    "message": "user edited"
                });
                db.close();
            });
        });
    });

app.delete('/users/:id',function(req, res) {

        MongoClient.connect(url, function(err, db) {

            var collection = db.collection('users');
            collection.remove({
                '_id': ObjectID(req.params.id)
            }, function(err, result) {
                res.status(202);
                res.json({
                    'message': 'user deleted'
                });
                db.close();
            });
        });
    });


app.listen(3000);
