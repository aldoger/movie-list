import { Request, Response, Router } from "express";
import { addGenre, editGenre } from "../handlers/genreController";
import { addFilm, addFilmToList, advanceSearchFilm, getDetailedFilm, getFilm } from "../handlers/filmControlller";
import { editProfile, getAllUser, getUserById, getUserProfile, logIn, signIn } from "../handlers/userController";
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
router.post("/edit-genre", roleAdminCheck, editGenre);

//film route
router.post("/add-film", roleAdminCheck, addFilm);
router.post("/add-list", roleUserCheck, addFilmToList);
router.get("/get-film", getFilm);
router.get("/get-detail-film", getDetailedFilm);
router.get("/advance-film-search", advanceSearchFilm);

//review route
router.post("/add-review", roleUserCheck, addFilmReview)
router.post("/edit-review", roleUserCheck, editFilmReview);

//like route
router.post("/like-review", roleUserCheck, likeReview);

//user route
router.post("/signin", signIn);
router.post("/login", logIn);
router.post("/edit-profile", roleUserCheck, editProfile);
router.get("/my-profile", roleUserCheck, getUserById);
router.get("/user-profile", getUserProfile);
router.get("/users", getAllUser);



export default router;