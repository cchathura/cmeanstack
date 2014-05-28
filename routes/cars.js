var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
console.log("top");
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('cardb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'cardb' database");
        db.collection('cars', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'cars' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving car: ' + id);
    db.collection('cars', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('cars', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.deleteCar = function(req, res) {
    var id = req.params.id;
    console.log('Deleting car: ' + id);
    db.collection('cars', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var cars = [
    {
        name: "vitz",
        year: "2009",
        brand: "toyota",
        country: "Japan",
        region: "asia",
        description: "toyota Vitz car",
        picture: "saint_cosme.jpg"
    },
    {
        name: "priuse",
        year: "2009",
        brand: "toyota",
        country: "Japan",
        region: "asia",
        description: "toyota Priuse car",
        picture: "viticcio.jpg"
    },
    {
        name: "city",
        year: "2009",
        brand: "honda",
        country: "Japan",
        region: "asia",
        description: "honda city car",
        picture: "ex_umbris.jpg"
    }];

    db.collection('cars', function(err, collection) {
        collection.insert(cars, {safe:true}, function(err, result) {});
    });

};
