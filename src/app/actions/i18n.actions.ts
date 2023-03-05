import { Action } from "@ngrx/store";
import { Language } from "../reducers";

export enum ActionTypes {
    Set = '[App Component] Set',
    Reset = '[App Component] Reset',
}

export type ActionsUnion = Set | Reset;

export class Set implements Action {
    readonly type = ActionTypes.Set;
    constructor (public payload: Language) {}
}

export class Reset implements Action {
    readonly type = ActionTypes.Reset;
}