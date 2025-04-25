import { Request, Response } from "express";
import film from "../Model/film";
import { addFilmDto } from "../dto/addFilm.dto";
import { addFilmToListDto } from "../dto/addFilmToList.dto";
import filmList from "../Model/film_list";
import { editFilmListStatusDto } from "../dto/editFilmListStatus.dto";
import { ObjectId } from "mongoose";
import review from "../Model/review";
import { advanceSearchFilmDto, getDetailedFilmDto } from "../dto/getDetailedFilm.dto";
import genre from "../Model/genre";

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
  
    const films = await film.find({}, 'title status total_episode release_date _id');


    const reviews = await review.find({}, 'rating movie_id');

    
    const ratingMap: Record<string, { total: number, count: number }> = {};

    reviews.forEach(({ movie_id, rating }) => {
      const id = movie_id.toString();
      if (!ratingMap[id]) {
        ratingMap[id] = { total: 0, count: 0 };
      }
      ratingMap[id].total += rating;
      ratingMap[id].count += 1;
    });

    const avgRatingMap: Record<string, number> = {};
    for (const id in ratingMap) {
      const { total, count } = ratingMap[id];
      avgRatingMap[id] = total / count;
    }

    const combinedFilms = [];

    for (let i = 0; i < films.length; i++) {
      const filmObj = films[i];
      const filmId = filmObj._id as string;
      const avgRating = avgRatingMap[filmId] || null;
    
      combinedFilms.push({
        ...filmObj.toObject(),
        avgRating
      });
    }

    
    if (combinedFilms.length > 0) {
      res.status(200).json({ films: combinedFilms });
    } else {
      res.status(400).json({ msg: "No films yet" });
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function getDetailedFilm(req: Request<any, any, getDetailedFilmDto>, res: Response) {
  const movieName = req.query.movie_name;
  try {
    const movie = await film.findOne({ title: movieName }).populate("genres");

    if (!movie) {
      res.status(404).json({ msg: "Movie not found" });
      return;
    }

    const movieReviews = await review.find({ movie_id: movie._id });

    const totalRating = movieReviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    const averageRating = movieReviews.length > 0 
      ? totalRating / movieReviews.length 
      : null;

    res.status(200).json({
      movie,
      averageRating,
      reviews: movieReviews
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
  }
}

export async function advanceSearchFilm(req: Request<any, any, any, advanceSearchFilmDto>, res: Response) {
  try {
    const { movie_name, genres, total_episode, status } = req.query;

    const query: any = {};

    // Title (partial match)
    if (movie_name) {
      query.title = { $regex: new RegExp(movie_name, 'i') };
    }

    // Genre (case-insensitive lookup)
    if (genres) {
      const genreList = Array.isArray(genres) ? genres : [genres];
      const genreDocs = await genre.find({
        genre: { $in: genreList.map(g => new RegExp(`^${g}$`, 'i')) }
      });

      const genreIds = genreDocs.map(g => g._id);
      query.genres = { $in: genreIds };
    }

    // Total episode (less than or equal)
    if (total_episode) {
      const total = total_episode;
      if (!isNaN(total)) {
        query.total_episode = { $lte: total };
      }
    }

    // Status (direct match)
    if (status) {
      query.status = status;
    }

    const moviesAdvance = await film.find(query).populate("genres");

    if (moviesAdvance.length > 0) {
      res.status(200).json({ moviesAdvance });
    } else {
      res.status(404).json({ msg: "No movies found with the given criteria." });
    }

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
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
