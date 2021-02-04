const express = require('express');
const port = 3000;
const fs = require('fs');
const chance = require('chance');

// create app handle to configure server
const app = express();

//MiddleWare
app.use(express.static("css"));
app.use(express.urlencoded({extended: true}));

let visitCount = 0;
let myChance = new chance();
let activeName = undefined;

// add handler for the / path
app.get("/", function(request, response){
    visitCount = visitCount + 1;
    

    const fileContents = fs.readFileSync("./templates/index.html", "utf-8");
    const formFileContents = fs.readFileSync("./templates/nameform.html", "utf-8");

    let updatedPage = fileContents.replace("%%%VISIT%%%", visitCount);
    
    if (activeName === undefined) {
        updatedPage = updatedPage.replace("%%%NAMEFORM%%%", formFileContents);
    } else {
        updatedPage = updatedPage.replace("%%%NAMEFORM%%%", "<p>Welcome, " + activeName + "</p>");
    }

    const filePage = fileContents.replace("%%%VISIT%%%", visitCount);

    response.send(updatedPage); 
});

app.get("/random", function(request, response){

    const randomNameContents = fs.readFileSync("./templates/random.html", "utf-8");
    const myNameFile = randomNameContents.replace("%%%NAME%%%", myChance.name());
    response.send(myNameFile);
})

app.post("/name", function(request, response){
    const name = request.body.name;
    activeName = name;

    response.redirect("/");
})
// start listening
app.listen(port, function(){
    console.log("App listening on port " + port);
});
