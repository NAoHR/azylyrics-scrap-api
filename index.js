const express = require("express");
const jsonData = require("./utils/jsonFile/example.json");
const {requestsData,validateRequests,parseIt,lyricsHandler} = require("./utils/handler.js");


const app = express();
const port = 3000;

app.get("/",(req,res)=>{
    res.send(jsonData)
})

app.get("/lyrics",(req,res)=>{
    res.send(jsonData.providedRoutes[1])
})
app.get("/lyrics/:songTitle",(req,res)=>{
    console.log(req.param)
    res.send(req.params)
})

app.get("/search",(req,res)=>{
    res.send(jsonData.providedRoutes[0])
})
app.get("/search/:title",async (req,res)=>{
    const newTitle = parseIt(req.params['title']);
    const data = await requestsData(`https://search.azlyrics.com/search.php?q=${newTitle}&w=songs&p=1`)
    const validated = validateRequests(data,"title");
    if(!validated){
        res.send({
            "Err" : true,
            "status" : "song not found",
            "message" : "please type it corrrectly"
        })
    }
    else{
        const newData = lyricsHandler(data)
        res.send(newData);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
