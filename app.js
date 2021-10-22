const express = require('express');
const path = require('path');
const fs = require('fs');
const { homedir } = require('os');
const port = 3000;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://HinaNayani:insiyasakina@cluster0.6wlka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//create
app.post('/users', (req, res) => {
  MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('node-demo');
    const collection = db.collection('users');
    collection
      .insertOne(req.body)
      .then(() => {
        res.redirect('/');
      })
      .catch(() => {
        res.redirect('/');
      });
  });
});

//read
app.get('/', (req, res) => {
  MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('node-demo');
    const collection = db.collection('users');
    collection
      .find()
      .toArray()
      .then((results) => {
        res.render('index.ejs', { users: results });
      })
      .catch((error) => {
        res.redirect('/');
      });
  });
});

//delete
app.delete('/users', (req, res) => {
  MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('node-demo');
    const collection = db.collection('users');
    collection
      .deleteOne(req.body)
      .then(() => {
        res.json(`Deleted user`);
      })
      .catch(() => {
        res.redirect('/');
      });
  });
});

//update
app.put('/users', (req, res) => {
  MongoClient.connect(uri , { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('node-demo');
    const collection = db.collection('users');
    collection
      .findOneAndUpdate(
        { fname: req.body.oldFname, lname: req.body.oldLname },
        {
          $set: {
            fname: req.body.fname,
            lname: req.body.lname
          }
        },
        {
          upsert: true
        }
      )
      .then(() => {
        res.json('Success');
      })
      .catch(() => {
        res.redirect('/');
      });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});