const express = require("express");
const jsonData = require("./utils/jsonFile/example.json");
const url = require("url");
const { requestsData,validateRequests,parseIt,songHandler,lyricsHandler,handlerQuery ,mainRequest, generateLink} = require("./utils/handler.js");

const app = express();
const port = 3000;

app.get("/",(req,res)=>{
    res.json(jsonData)
})

app.get("/lyrics",(req,res)=>{
    res.json(jsonData.providedRoutes[1])
})
app.get("/lyrics/:songLink",async (req,res)=>{
    const newTitle = parseIt(req.params["songLink"],"lyrics")
    const data = await requestsData(`https://www.azlyrics.com/lyrics/${newTitle}`);
    if(data == -1){
        res.json({
            "Err" : true,
            "status" : "song's lyrics not found",
            "message" : "please type it corrrectly (either the artist or the song)"
        });
    }else{
        const lyricsData = lyricsHandler(data);
        res.json(lyricsData);
    }
})

app.get("/search",(req,res)=>{
    res.json(jsonData.providedRoutes[0])
})
app.get("/search/:title",async (req,res)=>{
    const urlNew = url.parse(req.url,true);
    const requestedData = parseIt(req.params["title"],"song")
    const linkList = generateLink(urlNew.query)
    const data = await mainRequest(linkList,requestedData,`${req.protocol}://${req.get("host")}`);
    res.json(data);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
