import Storage from "../controllers/storage";
import { ADD_STORAGE, CHANGE_STORAGE_ADDRESS, CLEAR_STORAGE, StorageActions } from "../types/actions.types";

export const storageReducer = (state: Storage = new Storage(), action: StorageActions): Storage => {
    switch (action.type) {
        case ADD_STORAGE:
            return action.storage;
        case CHANGE_STORAGE_ADDRESS:
            state.setUserAddress(action.address);
            return state;
        case CLEAR_STORAGE:
            state.clearStorage(action.keepAddress);
            return state;
        default:
            return state;
    }
};
