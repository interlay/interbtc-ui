import Storage from "../controllers/storage";

const initialState = new Storage();

export const storageReducer = (state: Storage = initialState): Storage => {
    return state;
};
