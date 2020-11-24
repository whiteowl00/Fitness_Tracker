const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/Aaron_db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
  

/// html routes

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});


/// api routes

app.get('/api/workouts', (req, res) => {
  db.Workout.find({}).then((data) => {
    res.json(data);
  });
});

app.put('/api/workouts/:id', (req, res) => {
  db.Workout.findByIdAndUpdate(req.params.id, {exercises: req.body}).then((data)=>{res.json(data)});
});

app.post('/api/workouts', (req, res) => {
  db.Workout.create({}).then((data) => {res.json(data)});
});

app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({}).sort({day: -1}).limit(10).then((data) => {
    res.json(data);
  });
  
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});