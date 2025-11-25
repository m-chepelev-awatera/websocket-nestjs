export const filterUndefinedPropsOfDomainModel = <T>(obj: T): T => {
  const objectWithoutUndefinedProps: Record<string, unknown> = {};
  for (const prop in obj) {
    const isPropPrivate = prop.startsWith('_');
    if (obj[prop] !== undefined) {
      objectWithoutUndefinedProps[isPropPrivate ? prop.slice(1) : prop] =
        obj[prop];
    }
  }
  return objectWithoutUndefinedProps as T;
};
