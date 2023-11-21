const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const dataBasePath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());

let database = null;
const initializeaDbAndServer = async () => {
  try {
    database = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeaDbAndServer();

const convertDbObjecttoResponseDbObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};
app.get("/movies/", async (request, response) => {
  const getAllactors = `
    SELECT movie_name FROM movie`;
  const movieArray = await database.all(getAllactors);
  response.send(
    movieArray.map((eachplayer) =>
      convertDbObjecttoResponseDbObject(eachplayer)
    )
  );
});
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getAllactors = `
    SELECT * FROM movie WHERE movie_id=${movieId};`;
  const movieArray = await database.get(getAllactors);
  response.send(convertDbObjecttoResponseDbObject(movieArray));
});
app.get("/directors/", async (request, response) => {
  const getAllactors = `
    SELECT director_id,director_name FROM director;`;
  const movieArray = await database.all(getAllactors);
  response.send(convertDbObjecttoResponseDbObject(movieArray));
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { movieName } = request.params;
  const getAllactors = `
    SELECT movie_name FROM director WHERE movie_id=${movieId};`;
  const movieArray = await database.all(getAllactors);
  response.send(convertDbObjecttoResponseDbObject(movieArray));
});
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postAllactors = `
    INSERT INTO movie(director_id,movie_name,lead_actor) VALUES('${directorId}','${movieName}','${leadActor}')`;
  const movieArray = await database.run(postAllactors);
  response.send("Movie Successfully Added");
});
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const putAllactors = `
    UPDATE movie SET director_id='${directorId}',movie_name='${movieName}',lead_actor='${leadActor}' WHERE movie_id='${movieId}';`;
  const movieArray = await database.run(putAllactors);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteAllactors = `
    DELETE FROM movie WHERE movie_id='${movieId}';
    `;
  const movieArray = await database.run(deleteAllactors);
  response.send("Movie Removed");
});

module.exports = app;
