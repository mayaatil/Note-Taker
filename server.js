//require
const fs = require("fs");
const express = require("express");
const path = require("path");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

//initialize port and express
const app = express();
const PORT = process.env.PORT || 3001;

//sets up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//get fetch for intial homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/assets/index.html"));
});

//get fetch for the notes page
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/asets/notes.hmtl"));
});

const readFromFile = util.promisify(fs.readFile);

//writeFile
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written`)
  );

const readAndAppend = (content, file) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

//use get to receive notes as a string
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//post request
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      title_id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note successfully added!`);
  } else {
    res.error("Error in adding note");
  }
});

//listener
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
