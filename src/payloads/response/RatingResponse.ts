import {ERating} from "../../model/ERating";

export interface RatingResponse {
    eRating: ERating;
    numOfLikes: number;
    numOfDislikes: number;
}