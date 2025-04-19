import { Request, Response, Router } from "express";
import { addGenre } from "../handlers/genreController";
import { addFilm, addFilmToList, getDetailedFilm, getFilm } from "../handlers/filmControlller";
import { getAllUser, getUserById, getUserProfile, logIn, signIn } from "../handlers/userController";
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
router.get("/get-detail-film", getDetailedFilm)

//review route
router.post("/add-review", roleUserCheck, addFilmReview)
router.post("/edit-review", roleUserCheck, editFilmReview);

//like route
router.post("/like-review", roleUserCheck, likeReview);

//user route
router.post("/signin", signIn);
router.post("/login", logIn);
router.get("/my-profile", roleUserCheck, getUserById);
router.get("/user-profile", getUserProfile);
router.get("/users", getAllUser);


export default router;