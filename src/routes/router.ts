import { Request, Response, Router } from "express";
import addGenre from "../handlers/genreController";
import addFilm from "../handlers/filmControlller";


const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json("Hello World");
});

//genre route
router.post("/add-genre", addGenre);


//film route
router.post("/add-film", addFilm);

//user route
router.post("/signin");
router.post("/login")

export default router;