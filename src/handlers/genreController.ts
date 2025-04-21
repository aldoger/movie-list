import { Request, Response } from "express";
import genre from "../Model/genre";
import { addGenreDto } from "../dto/addGenre.dto";
import { editGenreDto } from "../dto/editGenre.dto";

export  async function addGenre(
  req: Request<any, any, addGenreDto>, 
  res: Response
) {
  const Genre = req.body.Genre;

  console.log((req as any).userId);

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

export async function getAllGenre(req: Request, res: Response){
  try{
    const Genre = await genre.find({});
    if(Genre.length > 0){
      res.status(200).json(
        { genres: Genre }
      );
      return;
    }else{
      res.status(400).json({ msg: "No genres yet" });
    }
  }catch(e: unknown){
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
}

export async function editGenre(req: Request<any, any, editGenreDto>, res: Response) {
  const id = req.body.genreId
  console.log(id);
  try{
    const Genre = await genre.findById(id).exec();

    if(Genre){
      Genre.genre = req.body.genre;
      Genre.save();

      res.status(200).json( { msg: "Succesfully change genre"});
      return;
    }
  }catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
}