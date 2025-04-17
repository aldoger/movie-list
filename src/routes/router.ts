import { Request, Response, Router } from "express";
import addGenre from "../handlers/genreController";
import addFilm from "../handlers/filmControlller";
import { logIn, signIn } from "../handlers/userController";
import { roleAdminCheck } from "../middleware/auth";



const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json("Hello World");
});

//genre route
router.post("/add-genre", roleAdminCheck, addGenre);


//film route
router.post("/add-film", addFilm);

//user route
router.post("/signin", signIn);
router.post("/login", logIn);


export default router;