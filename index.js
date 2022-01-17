const express = require("express");
const jsonData = require("./utils/jsonFile/example.json");
const {requestsData,validateRequests,parseIt,songHandler,lyricsHandler} = require("./utils/handler.js");


const app = express();
const port = 3000;

app.get("/",(req,res)=>{
    res.send(jsonData)
})

app.get("/lyrics",(req,res)=>{
    res.send(jsonData.providedRoutes[1])
})
app.get("/lyrics/:songLink",async (req,res)=>{
    const newTitle = parseIt(req.params["songLink"],"lyrics")
    const data = await requestsData(`https://www.azlyrics.com/lyrics/${newTitle}`);
    if(!data){
        res.send({
            "Err" : true,
            "status" : "song's lyrics not found",
            "message" : "please type it corrrectly (either the artist or the song)"
        });
    }else{
        const lyricsData = lyricsHandler(data);
        res.send(lyricsData);
    }
})

app.get("/search",(req,res)=>{
    res.send(jsonData.providedRoutes[0])
})
app.get("/search/:title",async (req,res)=>{
    const newTitle = parseIt(req.params['title'],"songs");
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
        const newData = songHandler(data,`${req.protocol}://${req.get("host")}`)
        res.send(newData);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
