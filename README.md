<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1419653396/fwahmgrgqtgrz9bw3hpk.png" alt="Logo" >
  </a>

  <h3 align="center">AZLYRICS SCRAPER</h3>

  <p align="center">
   Improvement version from my latest Azlyrics scraper that i made using python. This is a tool to scrape Azlyrics based on given title or a lyrics phrase
    <br />
  </p>
</div>
<br />
<br />

### Installations
1. Clone this repository
	```sh
	git clone https://github.com/NAoHR/azylyrics-scrap-api.git
	```
2.  Make it as current directory
	```sh
	cd azylyrics-scrap-api
	```
3. Do npm install to install all needed packages
	```sh
	npm install
	```
4. Run it, you can use nodemon or node to run this by typing
	```sh
	node index.js
	```
	or
	```sh
	nodemon index.js
	```

<details>
  <summary>
	  <h2 align="center">
	  <samp>
      details
    </samp>
    &#8779;
	  </h2>
  </summary>
  
  ```json
{
   "title": "how to use this api",
   "description": "this is a website that scrap azylyrics's song to get a certain lyrics",
   "content-type": "for educational only",
   "providedRoutes": [
      {
         "type": "search songs",
         "route": "/search",
         "desc": "search routes to get all credential data on data you've searched on.This will return a list based on the song title",
         "validSongTitle": "only seperated by space ( )",
         "example": {
            "plain": "/search",
            "withQuery": "/search?q=all",
            "exampleBody" : {
               "songname" : "what is love"
            }
         },
         "query": {
            "q": {
               "all": "to show requested song based on its lyrics and title",
               "l": "to show requested song based on its lyrics",
               "t": "to show requested song based on its title"
            }
         }
      },
      {
         "type": "get lyrics",
         "route": "/lyrics/artist_song.html",
         "desc": "after you get all the credential data of the song youve searched,use this route to get its lyrics",
         "validSongTitle": "/artist/songTitle.html",
         "example": "/search/twice_whatislove.html"
      }
   ]
}
  ```
  
</details>

## Disclaimer
I made this project only for educational and to improve my skill. dont do any illegal scrape-thing. if the website prevent you to scrape it,just don't do it