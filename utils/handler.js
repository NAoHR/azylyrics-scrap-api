const axios = require("axios");
const cheerio = require("cheerio");

const parseIt = (data) => {
    return data.split(" ").join("+")
}
const requestsData = async (link) =>{
    try{
        const data = await axios({
            "url" : link,
            "method" : "GET",
            "timeout" : 2000
        });
        return await data.data;
    }catch(Err){
        console.log(Err)
        return false;
    }
}
const validateRequests = (status,type)=>{
    if(!status){
        return {
            "Err" : true,
            "status" : "Not found",
            "desc" : `make sure you type ${type} correctly`
        }
    }else{
        const $ = cheerio.load(status);
        if($("div.alert-warning").text() == ""){
            return true
        }
        return false
    }
}


const lyricsHandler = (data) =>{
    const $ = cheerio.load(data);
    data = $("table.table-condensed > tbody").children()
    let list = []
    data.each((i,el)=>{
        if($(el).children("td").attr("class") != undefined){
            let seperateIt = $(el).children("td").children("a").text().split(" - ");
            list.push({
                "title" : seperateIt[0].split("\"").join(" "),
                "artist" : seperateIt[1],
                "link" : $(el).children("td").children("a").attr("href")
            })
        }
    })
    return {
        "Err" : false,
        "data" : list
    }
    
}
module.exports = {
    parseIt,
    requestsData,
    validateRequests,
    lyricsHandler
}