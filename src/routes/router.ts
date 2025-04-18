import { Request, Response, Router } from "express";
import { addGenre } from "../handlers/genreController";
import { addFilm, addFilmToList, getFilm } from "../handlers/filmControlller";
import { logIn, signIn } from "../handlers/userController";
import { roleAdminCheck, roleUserCheck } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json("Hello World");
});

//genre route
router.post("/add-genre", roleAdminCheck, addGenre);

//film route
router.post("/add-film", roleAdminCheck, addFilm);
router.post("/add-list", roleUserCheck, addFilmToList);
router.get("/get-film", getFilm);

//user route
router.post("/signin", signIn);
router.post("/login", logIn);


export default router;