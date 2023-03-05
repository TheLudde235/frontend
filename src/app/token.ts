import { Estate } from "./data-types";

export interface Token {
    uuid: string,
    email: string,
    username: string,
    admin: boolean,
    estates: Estate[],
    iat: number,
    exp: number
}
