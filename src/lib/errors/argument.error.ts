import { getParamNameAndValue } from '../validation/validation.helpers';

export class ArgumentError extends Error {
  constructor(message) {
    super(message);
  }

  static FromParam<T>(paramObject: { [key: string]: T }, errorDetails = '') {
    const param = getParamNameAndValue(paramObject);

    let message = `Невалидное значение параметра '${param.name}': '${param.value}'`;
    if (errorDetails) {
      message += ` - ${errorDetails}`;
    }

    return new ArgumentError(message);
  }
}
