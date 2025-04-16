
export interface addFilmDto {
    title: string;
    synopsis: string;
    images: string[];
    genre: string[]; // <-- ID dalam bentuk string, nanti di ubah ke bentuk ObjectId
    status: "not_yet_aired" | "airing" | "finished_airing";
    total_episode: number;
    release_date: Date;
  }
  