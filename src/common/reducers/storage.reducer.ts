import Storage from "../controllers/storage";
import { ADD_STORAGE, StorageActions } from "../types/actions.types";

export const storageReducer = (state: Storage | null = null, action: StorageActions): Storage | null => {
    switch (action.type) {
        case ADD_STORAGE:
            return action.storage;
        default:
            return state;
    }
};
