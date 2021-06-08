export const lazy = <T, P extends Array<any>>(fn: ((...p: P) => T)): (...p: P) => T => {
  const cache = new Map<string, T>();
  return (...p: P) => {
    const argsHashed = JSON.stringify(p);
    const cachedValue = cache.get(argsHashed);
    if (cachedValue === undefined) {
      const value = fn(...p);
      cache.set(argsHashed, value);
      return value;
    }
    return cachedValue;
  };
};
