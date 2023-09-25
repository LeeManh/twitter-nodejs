export const errorMessages = {
  emailExists: 'Email already exists',
  confirmPasswordNotMatch: 'Password confirmation does not match password',
  emailAndPasswordRequired: 'Email and password are required',
  validatorError: 'Validator Error'
} as const

export const USER_MESSAGE = {
  NAME_REQUIRED: 'Name is required',
  USER_NOT_FOUND: 'User not found',
  USER_NAME_LENGTH: 'Name must be between 3 and 20 characters',
  NAME_STRING: 'Name must be string',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  EMAIL_EXISTS: 'Email already exists',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_LENGTH: 'Password must be between 6 and 20 characters',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be between 6 and 20 characters',
  CONFIRM_PASSWORD_NOT_MATCH: 'Password confirmation does not match password',
  DATE_OF_BIRTH_INVALID: 'Date of birth must be ISO8601 format',
  LOGIN_SUCCESSFUL: 'Login successful',
  REGISTER_SUCCESSFUL: 'Register successful',
  VALIDATION_ERROR: 'Validation error',
  EMAIL_OR_PASSWORD_WRONG: 'Email or password is wrong',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  REFRESH_TOKEN_NOT_FOUND_OR_USED: 'Refresh token not found or used',
  ACCESS_TOKEN_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_NOT_MATCH: 'Refresh token does not match',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  VERIFY_EMAIL_SUCCESSFUL: 'Verify email successful',
  EMAIL_VERIFY_SUCCESSFUL: 'Email verify successful'
} as const
