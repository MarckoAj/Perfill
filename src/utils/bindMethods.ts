export function bindPublicMethods<T extends object>(instance: T): T {
  const prototype = Object.getPrototypeOf(instance) as Record<string, unknown>;

  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key === 'constructor') continue;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const property = descriptor?.value;

    if (typeof property === 'function') {
      Object.defineProperty(instance, key, {
        value: property.bind(instance),
        writable: true,
        configurable: true,
      });
    }
  }

  return instance;
}
