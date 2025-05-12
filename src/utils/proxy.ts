export function createStateProxy<T extends object>(
  obj: T,
  onSave: (obj: T) => void
): T {
  const deepCopy = (source: any): any => {
    if (source === null || typeof source !== "object") {
      return source;
    }

    if (source instanceof Map) {
      const mapCopy = new Map();
      source.forEach((value, key) => {
        mapCopy.set(key, deepCopy(value));
      });
      return mapCopy;
    }

    if (Array.isArray(source)) {
      return source.map((item) => deepCopy(item));
    }

    const copy: any = {};
    Object.keys(source).forEach((key) => {
      copy[key] = deepCopy(source[key]);
    });
    return copy;
  };

  const saveState = (): void => {
    try {
      const stateCopy: T = {} as T;

      Object.keys(obj).forEach((key) => {
        const value = (obj as any)[key];

        if (!(value instanceof Map)) {
          (stateCopy as any)[key] =
            value instanceof Object ? deepCopy(value) : value;
        }
      });

      onSave(stateCopy);
    } catch (error) {
      console.error("Error when saving state", error);
    }
  };

  const createNestedProxy = <U extends object>(
    target: U,
    path: (string | symbol)[] = []
  ): U => {
    return new Proxy(target, {
      get(target: U, prop: string | symbol): any {
        const value = Reflect.get(target, prop);

        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof Map)
        ) {
          return createNestedProxy(value as object, [...path, prop]) as any;
        }
        return value;
      },
      set(target: U, prop: string | symbol, value: any): boolean {
        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof Map)
        ) {
          Reflect.set(
            target,
            prop,
            createNestedProxy(value as object, [...path, prop])
          );
        } else {
          Reflect.set(target, prop, value);
        }
        saveState();
        return true;
      },
      deleteProperty(target: U, prop: string | symbol): boolean {
        if (Reflect.has(target, prop)) {
          Reflect.deleteProperty(target, prop);
          saveState();
        }
        return true;
      },
    });
  };

  return createNestedProxy(obj);
}
