export const REQUIRED = {
  required: 'This field is required.',
};

export const MIN_LENGTH = (length) => ({
  minLength: {
    value: length,
    message: `This field must be at least ${length} characters!`,
  },
});

export const MAX_LENGTH = (length) => ({
  maxLength: {
    value: length,
    message: `This field can't be longer than ${length} characters!`,
  },
});

export const MIN = (num) => ({
  min: {
    value: num,
    message: `This value must be above ${num - 1}`,
  },
});

export const MAX = (num) => ({
  max: {
    value: num,
    message: `This value must below ${num}`,
  },
});
