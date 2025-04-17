
export interface userSignInDto {
    email: string;
    username: string;
    password: string;
    role: "admin" | "user";
}