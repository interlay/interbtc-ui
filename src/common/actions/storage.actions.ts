import Storage from "../controllers/storage";
import { AddStorage, ADD_STORAGE } from "../types/actions.types";

export const addStorageInstace = (storage: Storage): AddStorage => ({
    type: ADD_STORAGE,
    storage,
});