import { getLanguage } from ".";
import { ActionsUnion, ActionTypes } from "../actions/i18n.actions";
import { Language } from "../models/runtime";

export const initialState = getLanguage(navigator.language);

export function i18nReducer(state: Language = initialState, action: ActionsUnion): Language{
    switch (action.type) {
        case ActionTypes.Set:
            return action.payload;
        case ActionTypes.Reset:
            return initialState;
        default:
            return state;
    }
}