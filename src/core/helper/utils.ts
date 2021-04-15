export const isJsonValid = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
};

export type Index<T> = {[key: string]: T}

export class Regexp {
  static readonly email = '^[^@]+@[^\\.]+\\..+';
}
