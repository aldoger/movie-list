import { Request, Response } from "express";
import genre from "../Model/genre";
import { addGenreDto } from "../dto/addGenre.dto";

export default async function addGenre(
  req: Request<any, any, addGenreDto>, 
  res: Response
) {
  const Genre = req.body.Genre;

  if (!Genre || Genre.trim() === "") {
    res.status(400).json({ msg: "Cannot send empty genre" });
    return;
  }

  try {
    const newGenre = new genre({ genre: Genre });
    const result = await newGenre.save();

    if (result) {
      res.status(200).json({ msg: "Genre created" });
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
