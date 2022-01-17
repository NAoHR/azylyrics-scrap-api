const axios = require("axios");
const cheerio = require("cheerio");

const parseIt = (data,type) => {
    if(type == "lyrics"){
        return data.split("_").join("/")
    }
    return data.split(" ").join("+")
}
const requestsData = async (link) =>{
    try{
        const data = await axios({
            "url" : link,
            "method" : "GET",
            "timeout" : 2000 // you can adjust the amount of this time in ms
        });
        return await data.data;
    }catch(Err){
        return false;
    }
}
const validateRequests = (status,type)=>{
    if(!status){
        return false
    }else{
        const $ = cheerio.load(status);
        if($("div.alert-warning").text() == ""){
            return true
        }
        return false
    }
}


const songHandler = (data,host) =>{
    const $ = cheerio.load(data);
    data = $("table.table-condensed > tbody").children()
    let list = []
    data.each((i,el)=>{
        if($(el).children("td").attr("class") != undefined){
            let seperateIt = $(el).children("td").children("a").text().split(" - ");
            list.push({
                "title" : seperateIt[0].split("\"").join(" "),
                "artist" : seperateIt[1],
                "link" : `${host}/lyrics/${$(el).children("td").children("a").attr("href").split("/lyrics/")[1].split("/").join("_")}`
            })
        }
    })
    return {
        "Err" : false,
        "data" : list
    }
    
}

const lyricsHandler = (data) => {
    const $ = cheerio.load(data);
    const base = $("div.col-xs-12.col-lg-8.text-center");
    let dataLyrics = base.children("div:not([class])");
    let dataWriter = base.children("div.smt").children("small");
    let panel = base.children("div.panel.album-panel.noprint");
    let dataPanel = []
    panel.each((i,el)=>{
        dataPanel.push($(el).text())
    })
    let lyrics =  dataLyrics.text().split("\n")
    const tobeReturned = {
        "Err" : false,
        "status" : "perfectly fetched",
        "message" : "no-log",
        "content" : {
            "writer" : dataWriter.text().split("Writer(s):")[1],
            "lyrics" : lyrics.length == 0 ? false : lyrics,
            "additional" : dataPanel.length == 0 ? "no data to be displayed" : dataPanel
        }
    }
    return tobeReturned
}
module.exports = {
    parseIt,
    requestsData,
    validateRequests,
    songHandler,
    lyricsHandler
}