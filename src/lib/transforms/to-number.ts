export function toFloat({ value }: { value: string }): number {
  return parseFloat(value);
}

export function toInt({ value }: { value: string }): number {
  return parseInt(value);
}

export function toArrayOfInts({ value }: { value: string[] }): number[] {
  return value.map((el) => parseInt(el));
}
