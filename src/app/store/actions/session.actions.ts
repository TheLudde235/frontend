import { Action } from "@ngrx/store";
import { Session } from "../models/runtime";

export enum ActionTypes {
    Set = '[Session] Set',
    Update = '[Session] Update',
    Logout = '[Session] Logout',
}

export class SetSession implements Action {
    readonly type = ActionTypes.Set;
    constructor (public payload: Session) {}
}

export class UpdateSession implements Action {
    readonly type = ActionTypes.Update;
    constructor (public payload: object) {}
}

export class ResetSession implements Action {
    readonly type = ActionTypes.Logout;
}

export type ActionsUnion = SetSession | UpdateSession | ResetSession;