import { Estate } from "src/app/data-types";

export type Language = 'en' | 'sv' | 'eo';

export type Session = {
    token: string,
    uuid: string,
    username: string,
    email: string,
    estates: Estate[],
    loggedIn: boolean,
    admin: boolean
}

export interface runtimeState {
    lang: Language;
    session: Session;
}