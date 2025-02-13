import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongosongsproject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const songSchema = new Schema({
    id: Number,
    trackName: String,
    artistName: String,
    genre: String,
    bpm: Number,
    energy: Number,
    danceability: Number,
    loudness: Number,
    liveness: Number,
    valence: Number,
    length: Number,
    acousticness: Number,
    speechiness: Number,
    popularity: Number
})

const Song = mongoose.model("Song", songSchema);


// RESET_DB=true npm run dev for MongoCompass
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany({})
   topMusicData.forEach((song) => {
      new Song(song).save()
    })
 }
  resetDatabase()
}
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


//Routes
app.get("/", (req, res) => {
  const navigation = {
    guide: "These are the routes for this Music data API!",
    Endpoints: [
      {
        "/": "Startpage",
        "/allsongs": "All tracks data",
        "/allsongs/:style": "Search for exisiting genre by adding /typeInGenreSearch"
      },
    ],
  };
  res.send(navigation);
});


//To get all songs
app.get("/allsongs", async (req, res) => {
  try {
    const allSongs = await Song.find();
    res.status(200).json({
      success: true,
      body: allSongs
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      } 
    })
  }
});

//To get specifik genre collection 
app.get("/allsongs/:style", async (req, res) => {
  try {
    const allSongs = await Song.find({ genre: req.params.style });
    res.status(200).json({
      success: true,
      body: allSongs
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});