const express = require("express");
const lyricsController = require("./controller/lyricsController");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended : true
}))

app.get("/", lyricsController.index)
app.get("/lyrics-guide",lyricsController.lyrics);
app.get("/lyrics/:songLink", lyricsController.songsLyrics)

app.get("/search-guide",lyricsController.searchGuide);
app.post("/search", lyricsController.search);

app.listen(process.env.PORT || 3000, () => {
    console.log(`app running`)
})
