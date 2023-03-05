import { i18nReducer } from "./i18n.reducer";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { hydrationMetaReducer } from "./hydration.reducer";
import { runtimeState, Language } from "../models/runtime";
import { sessionReducer } from "./session.reducer";
 

export function getLanguage(str: string): Language {
    switch (str.split('_')[0]) {
        case 'eo':
            return 'eo';
        case 'sv':
            return 'sv';
        default:
            return 'en';
    }
}


export const reducers: ActionReducerMap<runtimeState, any> = {
    lang: i18nReducer,
    session: sessionReducer
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];