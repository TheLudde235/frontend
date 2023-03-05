import { i18nReducer } from "./i18n.reducer";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { hydrationMetaReducer } from "./hydration.reducer";
 
export type Language = 'en' | 'sv' | 'eo';

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

export interface i18nState {
    lang: Language;
}

export const reducers: ActionReducerMap<i18nState, any> = {
    lang: i18nReducer
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];