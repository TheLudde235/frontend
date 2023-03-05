import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { runtimeState } from "../models/runtime";

export const hydrationMetaReducer = (
  reducer: ActionReducer<runtimeState>
): ActionReducer<runtimeState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem("runtime");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("runtime");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("runtime", JSON.stringify(nextState));
    return nextState;
  };
};