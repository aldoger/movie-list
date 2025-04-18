import { Request, Response } from "express";
import film from "../Model/film";
import { addFilmDto } from "../dto/addFilm.dto";
import { addFilmToListDto } from "../dto/addFilmToList.dto";
import filmList from "../Model/film_list";
import { editFilmListStatusDto } from "../dto/editFilmListStatus.dto";
import { ObjectId } from "mongoose";

export async function addFilm(
  req: Request<any, any, addFilmDto>,
  res: Response
) {
  const { title, synopsis, images, genre, status, total_episode, release_date } = req.body;

  if (!title || !genre || genre.length === 0) {
    res.status(400).json({ msg: "Missing title or genre" });
    return;
  }

  try {
    const newFilm = new film({
      title,
      synopsis,
      images,
      genres: genre, 
      status,
      total_episode,
      release_date
    });

    const result = await newFilm.save();
    res.status(200).json({ msg: "Film created", film: result });
    return;

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
}

export async function getFilm(req: Request, res: Response) {
  try {
    const Films = await film.find({});

    if (Films.length > 0) {
      res.status(200).json({ films: Films });
      return;
    } else {
      res.status(400).json({ msg: "No films yet" });
      return;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
}

export async function addFilmToList(req: Request<any, any, addFilmToListDto>, res: Response) {
  const { movie_id, status } = req.body;
  const id = (req as any).userId as ObjectId
  console.log("id in addfilm: ", id);

  try {

    if (!movie_id || !status) {
      res.status(400).json({ msg: "Cannot send empty values" });
      return;
    }

    const movie = await film.findById(movie_id).exec();

    if (!movie) {
      res.status(404).json({ msg: "Movie not found" });
      return;
    }

    if (movie.status === "not_yet_aired") {
      res.status(400).json({ msg: "Movie has not yet aired" });
      return
    }

    const newMovieInList = new filmList({
      user_id: id,
      movie_id: movie_id,
      status: status,
    });

    const result = await newMovieInList.save();

    if (result) {
      res.status(200).json({ msg: "Successfully added movie to list" });
      return;
    } else {
      res.status(400).json({ msg: "Cannot add movie to your list" });
      return;
    }

  } catch (err) {
    console.error("Error decoding token:", err);
    res.status(403).json({ msg: "Invalid token" });
  }
}

export async function editStatusFilmList(req: Request<any, any, editFilmListStatusDto>, res: Response) {
  const { movie_list_id, status, visibilty } = req.body;
  const id = (req as any).userId;


  try {

    const movieList = await filmList.findOne({
      user_id: id,
      _id: movie_list_id,
    });

    if (movieList) {
      movieList.status = status;
      movieList.visibility = visibilty;
      await movieList.save();

      res.status(200).json({ msg: "Successfully changed movie status in your list" });
      return;
    } else {
      res.status(400).json({ msg: "Cannot change movie status in your list" });
      return;
    }

  } catch (err) {
    console.error("Error decoding token:", err);
    res.status(403).json({ msg: "Invalid token" });
  }
}
