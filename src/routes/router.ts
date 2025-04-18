import { Request, Response, Router } from "express";
import { addGenre } from "../handlers/genreController";
import { addFilm, addFilmToList, getFilm } from "../handlers/filmControlller";
import { logIn, signIn } from "../handlers/userController";
import { roleAdminCheck, roleUserCheck } from "../middleware/auth";
import { addFilmReview, editFilmReview } from "../handlers/reviewCotnroller";
import { likeReview } from "../handlers/likeController";

const router = Router();


//test start server
router.get("/", (req: Request, res: Response) => {
    res.json("Welcome to movie list API");
});

//genre route
router.post("/add-genre", roleAdminCheck, addGenre);

//film route
router.post("/add-film", roleAdminCheck, addFilm);
router.post("/add-list", roleUserCheck, addFilmToList);
router.get("/get-film", getFilm);

//review route
router.post("/add-review", roleUserCheck, addFilmReview)
router.post("/edit-review", roleUserCheck, editFilmReview);

//like route
router.post("/like-review", roleUserCheck, likeReview);

//user route
router.post("/signin", signIn);
router.post("/login", logIn);


export default router;