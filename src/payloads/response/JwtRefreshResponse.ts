export interface JwtRefreshResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}