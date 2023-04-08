export default interface JwtResponse {
    token: string;
    type: string;
    refreshToken: string;
    username: string;
    email: string;
    roles: string[]
}