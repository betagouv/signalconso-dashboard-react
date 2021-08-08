export class Enum {

  static readonly entries = <T>(t: T): ReadonlyArray<readonly [keyof T, T[keyof T]]> => {
    const entries = Object.entries(t)
    const plainStringEnum = entries.every(
      ([key, value]) => typeof value === 'string',
    )
    return (plainStringEnum
      ? entries
      : entries.filter(([k, v]) => typeof v !== 'string')) as any
  }

  static readonly keys = <T>(t: T): ReadonlyArray<keyof T> => {
    return Enum.entries(t).map(([key]) => key)
  }

  static readonly values = <T>(t: T): ReadonlyArray<T[keyof T]> => {
    const values = Object.values(t)
    const plainStringEnum = values.every(x => typeof x === 'string')
    return plainStringEnum ? values : values.filter(x => typeof x !== 'string')
  }
}
