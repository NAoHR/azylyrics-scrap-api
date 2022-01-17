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
    dataLyrics = $("div.col-xs-12.col-lg-8.text-center").children("div:not([class])");
    dataWriter = $("div.col-xs-12.col-lg-8.text-center").children("div.smt").children("small");

    let lyrics =  dataLyrics.text().split("\n")
    const tobeReturned = {
        "Err" : false,
        "status" : "perfectly fetched",
        "message" : "no-log",
        "content" : {
            "writer" : dataWriter.text().split("Writer(s):")[1],
            "lyrics" : lyrics.length == 0 ? false : lyrics
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