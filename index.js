const express = require("express");
const CORS = require("cors");
const app = express();

const axios = require("axios");
app.use(CORS());

var SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: "cf90b348a3bd4640b9d6bb9468377205",
  clientSecret: "c5e86de91cab4150b6f82a15325c2981",
  redirectUri: "http://www.example.com/callback",
});

spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/:song", function (req, res) {
    
  let tracks = [];
    const song = req.params.song
    const limit = req.query.limit || 20
    const offset = req.query.offset || 0
  // Search tracks whose artist's name contains 'Love'
  spotifyApi
    .searchTracks(`track:${song}`, {
      limit: limit,
      offset: offset,
    })
    .then(
      function ({ body }) {
          body.tracks.items.forEach((song) => {
            let { name, artists, id, album } = song;
  
            tracks.push({
              name,
              "artists": {...artists},
              id,
              "album":album.name,
              "albumRelease":  album.release_date,
              "albumImages": album.images,
              "popularity": album.popularity
            });
          });
          res.status(200).json({
            status: "ok",
            data: tracks,
          });
        },
        function (err) {
          res.status(404).json({
            status: "error",
            message: err,
          }); 
      }
    );
});

app.listen(3000, function () {
  console.log("3000!");
});
