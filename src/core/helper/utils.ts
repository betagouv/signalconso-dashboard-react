import classNames from 'classnames'

export const isJsonValid = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false
  }
};

export type Index<T> = {[key: string]: T}

export class Regexp {
  static readonly email = '^[^@]+@[^\\.]+\\..+'
}

export const textOverflowMiddleCropping = (text: string, limit: number) => {
  return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - (limit / 2), text.length)}` : text
}

export const classes = classNames;
