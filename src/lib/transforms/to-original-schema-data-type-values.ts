import mongoose from 'mongoose';

export function isMongooseSubDoc(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    value instanceof mongoose.Document
  );
}

export function getOriginalSchemaValues<
  T extends mongoose.Document,
  K extends { [key: string]: any },
>(schema: T): K {
  const plainObj = schema.toObject();
  const originalSchemaValues = {};
  Object.keys(plainObj).forEach((key) => {
    const originalValue = schema[key];
    if (originalValue !== undefined) {
      if (isMongooseSubDoc(originalValue)) {
        originalSchemaValues[key] = getOriginalSchemaValues(originalValue);
      } else if (Array.isArray(originalValue)) {
        originalSchemaValues[key] = originalValue.map((i) =>
          isMongooseSubDoc(i) ? getOriginalSchemaValues(i) : i,
        );
      } else {
        originalSchemaValues[key] = originalValue;
      }
    }
  });
  return originalSchemaValues as K;
}
