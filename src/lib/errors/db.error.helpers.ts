export function isDuplicateError(e: Error) {
  return (e as any).code === 11000;
}
