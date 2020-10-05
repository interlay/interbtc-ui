import Storage from "../controllers/storage";
import {
    AddStorage,
    ADD_STORAGE,
    ChangeStorageAddress,
    CHANGE_STORAGE_ADDRESS,
    ClearStorage,
    CLEAR_STORAGE,
} from "../types/actions.types";

export const addStorageInstace = (storage: Storage): AddStorage => ({
    type: ADD_STORAGE,
    storage,
});

export const changeStorageAddress = (address: string): ChangeStorageAddress => ({
    type: CHANGE_STORAGE_ADDRESS,
    address,
});

export const clearStorage = (keepAddress = false): ClearStorage => ({
    type: CLEAR_STORAGE,
    keepAddress,
});
