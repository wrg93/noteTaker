//Required
const express = require("express");
const fs = require("fs");
const app = express();

//set up express app
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static("public"))

// set up and listed to PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Server is runnign on http://localhost:" + PORT)
});

//* GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function(req,res){
    res.sendFile(__dirname + "/notes.html")
});

// * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes",function(req, res){
    fs.readFile(__dirname + "/db.json", "utf8", (err,notes) => {
        if (err) throw err;
        const parseData = JSON.parse(notes)
        return res.json(parseData)
    });
});

//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
var savedNotes = [];
app.post("api/notes", function(req, res){

    const newNote = req.body;
    const id = 1;
    newNote.id=id;
    savedNotes.push(newNote);

    var counter = 1;
    for (var i=0; i <savedNotes.length; i++){
        savedNotes[i].id = counter++;
    }

    fs.writeFile(__dirname + "/db.json", JSON.stringify(savedNotes), (err) =>{
        if (err) throw err;
    });
    res.send(savedNotes)
});

