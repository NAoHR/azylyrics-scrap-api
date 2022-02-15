const express = require("express");
const jsonData = require("./utils/jsonFile/example.json");
const url = require("url");


const { requestsData,parseIt,lyricsHandler,mainRequest, generateLink} = require("./utils/handler.js");

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.json(jsonData)
})

app.get("/lyrics",(req,res)=>{
    res.json(jsonData.providedRoutes[1])
})
app.get("/lyrics/:songLink",async (req,res)=>{
    try{
        const urlNew = url.parse(req.url,true);
        const newTitle = parseIt(req.params["songLink"],"lyrics")
        const data = await requestsData(`https://www.azlyrics.com/lyrics/${newTitle}`);
        if(!data){
            return res.json({
                "Err" : true,
                "status" : "song's lyrics not found",
                "message" : "please type it corrrectly (either the artist or the song)"
            });
        }else{
            const lyricsData = lyricsHandler(data);
            return res.json(lyricsData);
        }
    }catch(e){
        return res.status(500).json({
            status : true,
            ErrorLog : "internal error"
        })
    }
})

app.get("/search-guide",(req,res)=>{
    res.json(jsonData.providedRoutes[0])
})
app.post("/search",async (req,res)=>{
    try{
        const {songname} = req.body
        if(songname){
            const urlNew = url.parse(req.url,true);
            const requestedData = parseIt(songname,"song")
            const linkList = await generateLink(urlNew.query)
            const data = await mainRequest(linkList,requestedData,`${req.protocol}://${req.get("host")}`);
            return res.status(200).json(data);
        }
        return res.status(400).json({
            status : false,
            ErrorLog : "songname not found on body"
        })
    }catch(e){
        return res.status(500).json({
            status : true,
            ErrorLog : "internal error"
        })
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app running`)
})
