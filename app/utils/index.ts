type TValidateValueOption = {
  length?: number;
};

type TValidateValueFn = (
  value: string,
  option?: TValidateValueOption
) => string | undefined;

export const validateValue: TValidateValueFn = (value, option) => {
  const length = option ? (option?.length ? option?.length : 1) : 1;

  if (typeof value !== 'string' || value.trim().length < length) {
    return `Value should be at least ${length} characters long`;
  }
};
