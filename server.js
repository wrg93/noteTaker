// Required packages
const express = require("express");
const fs = require("fs");
const app = express();

// set up express app
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"))

// set up and listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Server is running on http://localhost:" + PORT)
});

// displays notes html
app.get("/notes", function(req,res){
    res.sendFile(__dirname + "/public/notes.html")
});

// route that reads json file and sends to AJAX request
app.get("/api/notes",function(req, res){
   fs.readFile(__dirname + "/db/db.json", "utf8", (err, notes) => {
    if (err) throw err;
        const parseData= JSON.parse(notes)
        return res.json(parseData)
    });
});
     
//displays note take homepage
app.get("/",function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});

//gets access to id of deleted note, reads db.json file, and displays new arry with deleted note
app.delete("/api/notes/:id", function(req,res){
    const noteId = req.params.id;
    
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, notes) => {
        if (err) throw err;
            const parseData= JSON.parse(notes)
            savedNotes=parseData.filter(function(num){
            return num.id!=noteId;  
        });
        fs.writeFile(__dirname + "/db/db.json",JSON.stringify(savedNotes), (err) =>{
            if (err) throw err;   
        });
        res.send(savedNotes)
    });
});

// receives JSON note from user, adds id to note, pushes to array, and writes array to db.json file.
var savedNotes=[];
app.post("/api/notes", function(req,res){
   
  const newNote=req.body
    const id = 1
    newNote.id=id
    savedNotes.push(newNote)

    var counter = 1
    for (var i=0; i < savedNotes.length; i++){
        savedNotes[i].id = counter++;
    }

    fs.writeFile(__dirname + "/db/db.json",JSON.stringify(savedNotes), (err) =>{
        if (err) throw err;   
    });
res.send(savedNotes)
});