import { ActionTypes, ActionsUnion } from "../actions/session.actions";
import { Session } from "../models/runtime";

export const initialState: Session = {
    token: '',
    uuid: '',
    username: '',
    email: '',
    loggedIn: false,
    admin: false
}

export function sessionReducer(state: Session = initialState, action: ActionsUnion): Session{
    switch (action.type) {
        case ActionTypes.Set:
            return action.payload;
        case ActionTypes.Update:
            return {...state, ...action.payload};
        case ActionTypes.Logout:
            return initialState;
        default:
            return state;
    }
}