const axios = require("axios");
const cheerio = require("cheerio");

// credential
const parseIt = (data,type) => {
    // to parse given link fro plain express request
    if(type == "lyrics"){
        return data.split("_").join("/")
    }
    return data.split(" ").join("+")
}
const requestsData = async (link) =>{
    // request data and get the credential html code.
    try{
        const data = await axios({
            "url" : link,
            "method" : "GET",
            "timeout" : 5000, // you can adjust the amount of this time in ms
        });
        return await data.data;
    }catch(Err){
        return -1;
    }
}
const validateRequests = (dataRes)=>{
    // to validate if the request has returned html containing no data
    const $ = cheerio.load(dataRes);

    if($("div.alert-warning").text() == ""){
        return true
    }
    return false
}
const generateLink = (cred) => {
    // to generate link based on given url query
    // will be returned data with 'type t' if nothing passed
    const willbeProccededData = [
        {
            "type" : "t",
            "nameType" : "title",
            "name" : "titleBased",
            "link" : "https://search.azlyrics.com/search.php?q=",
            "query" :"&w=songs&p=1"
        },
        {
            "type" : "l",
            "nameType" : "lyrics",
            "name" : "lyricBased",
            "link" : "https://search.azlyrics.com/search.php?q=",
            "query" :"&w=lyrics&p=1"
        }
    ]
    if(cred["q"] != undefined){
        if(cred["q"] == "t" || cred["q"] == "l"){
            return willbeProccededData.filter((item)=> item.type == cred["q"]);
    
        }else if(cred["q"] == "all"){
            return willbeProccededData;
        }
    }
    return [willbeProccededData[0]]
}
const mainRequest = async (generatedLink,parsedUserInput,host) =>{
    // fusion of all request,parse, and validate and error handling if request went error
    const waitAllReq = await Promise.all(generatedLink.map(async (item) => {
        const req = await requestsData(`${item['link']}${parsedUserInput}${item['query']}`);
        if(req == -1){
            return {
                "status" : false,
                "ErrorLog" : "requests went failed",
                "name" : item["name"],
                "willBeProccededData" : [],
            }
        }else{
            if(validateRequests(req,"song")){
                if(item.type == "t"){
                    return {
                        "status" : true,
                        "ErrorLog" : `no Error`,
                        "name" : item["name"],
                        "willBeProccededData" : songHandler(req,host,item["type"]),
                    }
                }
                return {
                    "status" : true,
                    "ErrorLog" : `no Error`,
                    "name" : item["name"],
                    "willBeProccededData" : songHandler(req,host,item["type"]),
                }
            }else{
                return {
                    "status" : false,
                    "ErrorLog" : `requests didnt match any data`,
                    "name" : item["name"],
                    "willBeProccededData" : [],
                }
            }
        }
    }))
    return await waitAllReq;
}

const songHandler = (data,host,type) =>{
    // this function is mainly to handle given array data from mainRequest's proccess
    // this function will parse and search link and title from given html that are parsed on mainRequest
    const $ = cheerio.load(data);
    data = $("table.table-condensed > tbody").children()
    let list = []
    data.each((i,el)=>{
        if($(el).children("td").attr("class") != undefined){
            let seperateIt = $(el).children("td").children("a").text().split(" - ");
            if(type == "l"){
                let artistName = seperateIt[1].split("\n")
                list.push({
                    "title" : seperateIt[0].split("\"").join(" "),
                    "artist" : artistName[0],
                    "on" : artistName.slice(1).join(" ").replace("                     ",""),
                    "link" : `${host}/lyrics/${$(el).children("td").children("a").attr("href").split("/lyrics/")[1].split("/").join("_")}`
                });
            }else{
                list.push({
                    "title" : seperateIt[0].split("\"").join(" "),
                    "artist" : seperateIt[1],
                    "link" : `${host}/lyrics/${$(el).children("td").children("a").attr("href").split("/lyrics/")[1].split("/").join("_")}`
                });
            }
        };
    });
    return list;
}

const lyricsHandler = (data) => {
    // function to handle given html after all parsed stuff is done.
    // this function mainly to get a lyric and other containing credential from a chosen song
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
    lyricsHandler,
    mainRequest,
    generateLink
}