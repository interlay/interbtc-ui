import { KVStorageInterface } from "../types/Storage";

export default class KVStorage implements KVStorageInterface {
  getValue(key: string) {
    let value = localStorage.getItem(key);
    if (value != null) {
      return value;
    } else {
      return "";
    }
  }

  setValue(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
