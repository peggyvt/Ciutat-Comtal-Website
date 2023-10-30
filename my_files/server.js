var http = require("http"); // creating an http server
var fs = require("fs");

var express = require("express");
const sessions = require('express-session');

var bodyParser = require("body-parser");
var app = express(); // starting an express app
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost/";

app.listen(8888, function() {
    console.log('Server running at http://127.0.0.1:8888/');
});
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended:true }));

//session middleware
app.use(sessions({
    secret: "thisismysecretkey",
    saveUninitialized: true,
    resave: false 
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// a variable to save a session
var session;

/* BASIC ENDPOINTS: SIGN-UP/ SIGN-IN/ SIGN-OUT/ UPDATE-USER-DATA */

app.post('/UpdateData', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").updateOne({email: req.body.email}, {$set: {username:  req.body.username, name: req.body.name, email: req.body.email, password: req.body.password}}, function(err1, row) {
                if(err1) {
                    console.log('Error updating document into collection users!');
                    throw err1;
                } else {
                    console.log("Document updated successfully into collection users!");
                    session=req.session;
                    session.useremail=req.body.email;
                    console.log(req.session)
                    console.log("ROW "+row)
                    var myobj = {username: req.body.username, name: req.body.name, email: req.body.email, password: req.body.password};
                    console.log("MYOBJ : "+myobj) 
                    myobj['session'] = req.session.useremail;
                    console.log(req.body.email, req.body.password);
                    res.render('user-account', {data:myobj});
                }
                db.close();
            });
        }
    });
});

app.post('/SignUp', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").findOne({email: req.body.email}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection users!');
                    throw err1;
                } else {
                    if(row == null) {
                        var username = "user-"+Math.floor(Math.random() * Math.floor(99999));
                        var myobj = {username: username, name: req.body.name, email: req.body.email, password: req.body.password};
                        dbo.collection("users").insertOne(myobj, function(err2, row1) {
                            if(err2) {
                                console.log('Error inserting documents from collection users!');
                                throw err2;
                            } else {
                                console.log("Document inserted successfully into collection users!");
                                session=req.session;
                                session.useremail=req.body.email;
                                console.log(req.body.email, req.body.password);
                                myobj['session'] = req.session.useremail;
                                res.render('user-account', {data:myobj});
                            }
                            db.close();
                        });
                    } else {
                        console.log("Email already exists!");
                    }
                }
            });
        }
    });
});

app.post('/SignIn', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").findOne({'email': req.body.email, 'password': req.body.password}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection users!');
                    throw err1;
                } else {
                    if(row == null) {
                        console.log("Row is "+row);
                        console.log("Incorrect email or password.");
                        res.render('user-home', {"session": req.session.useremail});
                    } else {
                        console.log(row);
                        session=req.session;
                        session.useremail=req.body.email;
                        console.log(req.session);
                        console.log(req.body.email, req.body.password);
                        row['session'] = session.useremail;
                        console.log("row['session']: "+row['session']);
                        if(session.useremail == "admin@admin.com") {
                            console.log("this is redirecting to admin-account");
                            console.log("session.useremail: "+session.useremail);
                            console.log("row['session']: "+row['session']);
                            res.render('admin-account', {data:row});
                        } else {
                            console.log("this is redirecting to user-account");
                            res.render('user-account', {data:row});
                        }
                    }
                }
                db.close();
            });
        }
    });
});

app.post('/SignOut', function(req,res) {
    console.log('...destroying session!');
    req.session.destroy();
    console.log('Session destroyed!');
    res.render('user-home', {"session": null});
});

/* ADMIN ENDPOINTS */

app.get("/admin-home", function(req, res) {
    res.render('admin-home', {"session": req.session.useremail});
});

app.get("/admin-users", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection users!');
                    throw err1;
                } else {
                    console.log('Collection users selected successfully!');
                    var counter = 0;
                    rows.forEach(row => {
                        counter = counter + 1;
                    });
                    rows['session'] = req.session.useremail;
                    rows['counter'] = counter - 1;
                    res.render('admin-users', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/EditUser", function(req, res) {
    var username = req.body.username; 
    var name = req.body.name; 
    var email = req.body.email; 
    var password = req.body.password;
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").updateOne({_id: new ObjectId(id)}, {$set: {username:  username, name: name, email: email, password: password}}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection users!');
                    throw err1;
                } else {
                    console.log('Collection users selected successfully!');
                    res.redirect('admin-users');
                }
                db.close();
            });
        }
    });
});

app.post("/DeleteUser", function(req, res) {
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").deleteOne({_id: new ObjectId(id)}, function(err1, row) {
                if(err1) {
                    console.log('Error deleting document from collection users!');
                    throw err1;
                } else {
                    console.log('Document deleted successfully from collection users!');
                    res.redirect('admin-users');
                }
                db.close();
            });
        }
    });
});

app.get("/admin-attractions", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("attractions").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection attractions!');
                    throw err1;
                } else {
                    console.log('Collection attractions selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('admin-attractions', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/AddAttraction", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var desc = req.body.desc;
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            var myobj = {name: name, img: img, desc: desc};
            dbo.collection("attractions").insertOne(myobj, function(err1, row) {
                if(err1) {
                    console.log('Error inserting documents from collection attractions!');
                    throw err1;
                } else {
                    console.log('Document inserted successfully into collection attractions!');
                    res.redirect('admin-attractions');
                }
                db.close();
            });
        }
    });
});

app.post("/EditAttraction", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var desc = req.body.desc;
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("attractions").updateOne({_id: new ObjectId(id)}, {$set: {name: name, img: img, desc: desc}}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection attractions!');
                    throw err1;
                } else {
                    console.log('Collection attractions selected successfully!');
                    res.redirect('admin-attractions');
                }
                db.close();
            });
        }
    });
});

app.post("/DeleteAttraction", function(req, res) {
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("attractions").deleteOne({_id: new ObjectId(id)}, function(err1, row) {
                if(err1) {
                    console.log('Error deleting document from collection attractions!');
                    throw err1;
                } else {
                    console.log('Document deleted successfully from collection attractions!');
                    res.redirect('admin-attractions');
                }
                db.close();
            });
        }
    });
});

app.get("/admin-reservations", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("accommodation-reservations").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection accommodation-reservations!');
                    throw err1;
                } else {
                    console.log('Collection accommodation-reservations selected successfully!');
                    var counter = 0;
                    rows.forEach(row => {
                        counter = counter + 1;
                    });
                    rows['session'] = req.session.useremail;
                    rows['counter'] = counter;
                    res.render('admin-reservations', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/CancelReservation", function(req, res) {
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("accommodation-reservations").deleteOne({_id: new ObjectId(id)}, function(err1, row) {
                if(err1) {
                    console.log('Error deleting document from collection accommodation-reservations!');
                    throw err1;
                } else {
                    console.log('Document deleted successfully from collection accommodation-reservations!');
                    res.redirect('admin-reservations');
                }
                db.close();
            });
        }
    });
});

app.get("/admin-events", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("events").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection events!');
                    throw err1;
                } else {
                    console.log('Collection events selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('admin-events', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/AddEvent", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var dates = req.body.dates; 
    var tickets = req.body.tickets; 
    var iframe = req.body.iframe;
    var desc = req.body.desc;
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            var myobj = {name: name, img: img, dates: dates, tickets: tickets, iframe: iframe, desc: desc, tickets_counter: 0};
            dbo.collection("events").insertOne(myobj, function(err1, row) {
                if(err1) {
                    console.log('Error inserting documents from collection events!1');
                    throw err1;
                } else {
                    console.log('Document inserted successfully into collection events!');
                    res.redirect('admin-events');
                }
                db.close();
            });
        }
    });
});

app.post("/EditEvent", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var dates = req.body.dates; 
    var tickets = req.body.tickets; 
    var tickets_counter = req.body.tickets_counter;
    var iframe = req.body.iframe;
    var desc = req.body.desc;
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("events").updateOne({_id: new ObjectId(id)}, {$set: {name: name, img: img, dates: dates, tickets: tickets, iframe: iframe, desc: desc, tickets_counter: tickets_counter}}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection events!');
                    throw err1;
                } else {
                    console.log('Collection events selected successfully!');
                    res.redirect('admin-events');
                }
                db.close();
            });
        }
    });
});

app.post("/DeleteEvent", function(req, res) {
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("events").deleteOne({_id: new ObjectId(id)}, function(err1, row) {
                if(err1) {
                    console.log('Error deleting document from collection events!');
                    throw err1;
                } else {
                    console.log('Document deleted successfully from collection events!');
                    res.redirect('admin-events');
                }
                db.close();
            });
        }
    });
});

app.get("/admin-activities", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection activities!');
                    throw err1;
                } else {
                    console.log('Collection activities selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('admin-activities', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/AddActivity", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var category = req.body.category; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            var myobj = {name: name, img: img, category: category};
            dbo.collection("activities").insertOne(myobj, function(err1, row) {
                if(err1) {
                    console.log('Error inserting documents from collection activities!');
                    throw err1;
                } else {
                    console.log('Document inserted successfully into collection activities!');
                    res.redirect('admin-activities');
                }
                db.close();
            });
        }
    });
});

app.post("/EditActivity", function(req, res) {
    var name = req.body.name; 
    var img = req.body.img; 
    var category = req.body.category;
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").updateOne({_id: new ObjectId(id)}, {$set: {name: name, img: img, category: category}}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting documents from collection activities!');
                    throw err1;
                } else {
                    console.log('Collection activities selected successfully!');
                    res.redirect('admin-activities');
                }
                db.close();
            });
        }
    });
});

app.post("/DeleteActivity", function(req, res) {
    var id = req.query.id; 
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").deleteOne({_id: new ObjectId(id)}, function(err1, row) {
                if(err1) {
                    console.log('Error deleting document from collection activities!');
                    throw err1;
                } else {
                    console.log('Document deleted successfully from collection activities!');
                    res.redirect('admin-activities');
                }
                db.close();
            });
        }
    });
});

app.get("/admin-account", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").findOne({'email': req.session.useremail}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting user from collection users!');
                    throw err1;
                } else {
                    res.render('admin-account', {data:row});
                }
                db.close();
            });
        }
    });
});

/* USER PAGES - GET */

app.get("/", function(req, res) {
    res.render('user-home', {"session": req.session.useremail});
});

app.get("/user-home", function(req, res) {
    res.render('user-home', {"session": req.session.useremail});
});

app.get("/user-barna", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("attractions").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection attractions!');
                    throw err1;
                } else {
                    console.log('Collection attractions selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('user-barna', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.get("/user-accommodations", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("accommodations").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection accommodations!');
                    throw err1;
                } else {
                    console.log('Collection accommodations selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('user-accommodations', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.get("/user-events", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("events").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection events!');
                    throw err1;
                } else {
                    console.log('Collection events selected successfully!');
                    rows['session'] = req.session.useremail;
                    console.log(req.session.useremail);
                    res.render('user-events', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.get("/user-activities", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection activities!');
                    throw err1;
                } else {
                    console.log('Collection activities selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('user-activities', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.get("/user-barna-rating", function(req, res) {
    res.render('user-barna-rating', {"session": req.session.useremail});
});

app.get("/user-experiences", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("ratings").find({}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting documents from collection ratings!');
                    throw err1;
                } else {
                    console.log('Collection ratings selected successfully!');
                    var total = 0;
                    var counter = 0;
                    rows.forEach(row => {
                        total = total + parseInt(row['rate']);
                        counter = counter + 1;
                        console.log("row['rate']: "+row['rate']);
                        console.log("total: "+total);
                        console.log("counter: "+counter);
                    });
                    rows['avg'] = total/counter;
                    rows['session'] = req.session.useremail;
                    res.render('user-experiences', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.get("/user-registration", function(req, res) {
    res.render('user-registration', {"session": req.session.useremail});
});

app.get("/user-account", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("users").findOne({'email': req.session.useremail}, function(err1, row) {
                if(err1) {
                    console.log('Error selecting user from collection users!');
                    throw err1;
                } else {
                    res.render('user-account', {data:row});
                }
                db.close();
            });
        }
    });
});

/* USER ENTRYPOINTS - POST */

app.post("/ActivitiesFilter", function(req, res) {
    var filter = req.body.filter;
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").find({category: filter}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting specific filter from collection activities!');
                    throw err1;
                } else {
                    console.log('Specific filter from collection activities selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('user-activities', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/SelectSearchBar", function(req, res) {
    var search = req.body.search;
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("activities").find({name: { $regex : new RegExp(search, "i") } }).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting from collection activities!');
                    throw err1;
                } else {
                    console.log('Collection selected successfully!');
                    rows['session'] = req.session.useremail;
                    console.log(rows);
                    res.render('user-activities', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/UploadReview", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var email = req.session.useremail;
            var filename = req.body.filename;
            var rate = req.body.rate;
            var review = req.body.review;
            var myobj = {email: email, filename: filename, rate: rate, review: review};
            var dbo = db.db("barcelonadb");
            dbo.collection("ratings").insertOne(myobj, function(err2, row1) {
                if(err2) {
                    console.log('Error inserting documents from collection ratings!');
                    throw err2;
                } else {
                    console.log("Document inserted successfully into collection ratings!");
                }
                db.close();
            });
        }
    });
    res.render('user-barna-rating', {"session": req.session.useremail});
});

app.post("/AccommodationsFilter", function(req, res) {
    var filter = req.body.filter;
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            dbo.collection("accommodations").find({category: filter}).toArray(function(err1, rows) {
                if(err1) {
                    console.log('Error selecting specific filter from collection accommodations!');
                    throw err1;
                } else {
                    console.log('Specific filter from collection accommodations selected successfully!');
                    rows['session'] = req.session.useremail;
                    res.render('user-accommodations', {data:rows});
                }
                db.close();
            });
        }
    });
});

app.post("/SubmitAccommodationReservation", function(req, res) {
    var accommodation_name = req.body.accommodation_name;
    var accommodation_date_from = req.body.accommodation_date_from;
    var accommodation_date_to = req.body.accommodation_date_to;
    var price = req.body.price;

    var name = req.body.name;
    var surname = req.body.surname;
    var dob = req.body.date_of_birth;
    var id = req.body.id_number;

    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            var guests = [];
            if (name.constructor === Array) {
                for (var i=0; i<name.length; i++) { 
                    guests[i] = {"name": name[i], "surname": surname[i], "dob": dob[i], "id": id[i]}
                }
            } else {
                guests[0] = {"name": name, "surname": surname, "dob": dob, "id": id}
            }
            var myobj = {accommodation_name: accommodation_name, accommodation_date_from: accommodation_date_from, accommodation_date_to: accommodation_date_to, price: price, guests: guests};
            dbo.collection("accommodation-reservations").insertOne(myobj, function(err2, row1) {
                if(err2) {
                    console.log('Error inserting documents from collection accommodation-reservations!');
                    throw err2;
                } else {
                    console.log("Document inserted successfully into collection accommodation-reservations!");
                    dbo.collection("accommodations").find({}).toArray(function(err1, rows) {
                        if(err1) {
                            console.log('Error selecting documents from collection accommodations!');
                            throw err1;
                        } else {
                            console.log('Collection accommodations selected successfully!');
                            rows['session'] = req.session.useremail;
                            res.render('user-accommodations', {data:rows});
                        }
                    });
                }
            });
        }
    });
});

app.post("/SubmitEventReservation", function(req, res) {
    var event_name = req.body.event_name;
    var event_date = req.body.event_date;
    var price = req.body.price;

    var name = req.body.name;
    var surname = req.body.surname;
    var dob = req.body.date_of_birth;
    var id = req.body.id_number;

    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('MongoDB connection failed!');
            throw err;
        } else {
            console.log('MongoDB connected successfully!');
            var dbo = db.db("barcelonadb");
            var guests = [];
            var count = 0;
            if (name.constructor === Array) {
                for (var i=0; i<name.length; i++) { 
                    count = name.length;
                    guests[i] = {"name": name[i], "surname": surname[i], "dob": dob[i], "id": id[i]}
                }
            } else {
                count = 1;
                guests[0] = {"name": name, "surname": surname, "dob": dob, "id": id}
            }
            var myobj = {event_name: event_name, event_date: event_date, price: price, guests: guests};
            dbo.collection("event-reservations").insertOne(myobj, function(err2, row1) {
                if(err2) {
                    console.log('Error inserting documents from collection event-reservations!');
                    throw err2;
                } else {
                    console.log("Document inserted successfully into collection event-reservations!");
                    dbo.collection("events").updateOne({name: event_name}, {$inc: { "tickets_counter":  count}}, function(err1, row) {
                        if(err1) {
                            console.log('Error selecting documents from collection events!');
                            throw err1;
                        } else {
                            console.log("Document updated successfully into collection events!");
                            console.log("row1: "+row1);
                            console.log("row1.insertedId: "+row1.insertedId);
                            dbo.collection("event-reservations").findOne({_id: new ObjectId(row1.insertedId)}, function(err1, row2) {
                                if(err1) {
                                    console.log('Error selecting reservation from collection event-reservations!');
                                    throw err1;
                                } else {
                                    res.render('user-ticket', {data:row2});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});