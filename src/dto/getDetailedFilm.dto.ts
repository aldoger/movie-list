
export interface getDetailedFilmDto {
    movie_name: string;
}

export interface advanceSearchFilmDto {
    movie_name: string;
    genres?: string[];
    status?: "not_yet_aired" | "airing" | "finished_airing";
    total_episode?: number;
}