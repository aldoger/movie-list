import { Request, Response } from "express";
import { editReviewDto } from "../dto/addReveiw.dto";
import review  from "../Model/review" 
import filmList from "../Model/film_list";
import film from "../Model/film";



export async function addFilmReview(req: Request<any, any, editReviewDto>, res: Response) {
    const {  movie_list_id, reviewText, rating } = req.body;
    const user_id = (req as any).userId;

    if(!user_id || !movie_list_id || !review ) {
        res.status(400).json({ msg: "Cannot send empty values"});
        return;
    }

    try{

        const checkReview = await review.findOne({ user_id: user_id, movie_list_id: movie_list_id}).exec();

        if(checkReview){
            res.status(400).json({ msg: "Cannot add another review to the same movie"});
            return;
        }

        const movieList = await filmList.findById(movie_list_id).exec();

        const movieStatus = await film.findById(movieList?.movie_id).exec();

        if(movieStatus?.status == "not_yet_aired"){
            res.status(400).json({ msg: "Cannot review a movie that has not aired"});
            return;
        }


        if(movieList?.status === "plan_to_watch"){
            res.status(400).json({ msg: "Cannot review a film with status plat_to_watch"});
            return;
        }

        const newReview = new review({
            user_id: user_id,
            movie_list_id: movie_list_id,
            reviewText: reviewText,
            rating: rating,
        });

        const result = await newReview.save();

        if(result){
            res.status(200).json({ msg: "review successfully created"});
            return;
        }else{
            res.status(400).json({ msg: "Cannot create review"});
            return;
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


export async function editFilmReview(req: Request<any, any, editReviewDto>, res: Response) {
    const { movie_list_id, rating, reviewText } = req.body;
    const user_id = (req as any).userId;

    if(!user_id || !movie_list_id || !review ) {
        res.status(400).json({ msg: "Cannot send empty values"});
        return;
    }

    try{

        const movieList = await filmList.findById(movie_list_id).exec();

        const movieStatus = await film.findById(movieList?.movie_id).exec();

        if(movieStatus?.status == "not_yet_aired"){
            res.status(400).json({ msg: "Cannot review a movie that has not aired"});
            return;
        }


        if(movieList?.status === "plan_to_watch"){
            res.status(400).json({ msg: "Cannot review a film with status plat_to_watch"});
            return;
        }

        const checkReview = await review.findOne({ user_id: user_id, movie_list_id: movie_list_id}).exec();

        if(checkReview){
            checkReview.rating = rating;
            checkReview.reviewText = reviewText;

            checkReview.save();

            res.status(200).json({ msg: "successfully edit review"});
            return;
        }else{
            res.status(400).json({ msg: "Cannot find review"});
            return;
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