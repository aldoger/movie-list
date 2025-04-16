import { Request, Response } from "express";
import film from "../Model/film";
import { addFilmDto } from "../dto/addFilm.dto";

export default async function addFilm(
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
