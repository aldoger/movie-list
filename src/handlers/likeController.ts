import { Request, Response } from "express";
import { likeReviewDto } from "../dto/likeReview.dto";
import review, { Likes } from "../Model/review";


export async function likeReview(req: Request<any, any, likeReviewDto>, res: Response) {
    const { review_id, status } = req.body;
    const user_id = (req as any).userId;

    if (!review_id || !status || !user_id) {
        res.status(400).json({ msg: "Missing review_id, status, or user_id" });
        return;
    }

    try {
        const Review = await review.findById(review_id);
        if (!Review) {
            res.status(404).json({ msg: "Review not found" });
            return;
        }

        const checkLike = Review.likes.find((like) => {
            like.user_id == user_id;
        });

        if (checkLike) {
          
            checkLike.status = status;
            await Review.save();

            res.status(200).json({ msg: `Successfully updated your ${status} on the review` });
        } else {
           
            const newLike: Likes = {
                user_id: user_id,
                status: status,
            };

            Review.likes.push(newLike);
            await Review.save();

            res.status(200).json({ msg: `Successfully ${status}d the review` });
        }
    } catch (e: unknown) {
        console.error("Error liking review:", e);
        res.status(500).json({ msg: "Something went wrong" });
    }
}
