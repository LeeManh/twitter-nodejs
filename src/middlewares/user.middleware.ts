import { checkSchema } from 'express-validator'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'

import { databaseService } from '~/services/database.service'
import { userService } from '~/services/user.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validate'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })

            if (!user) {
              throw new Error(USER_MESSAGE.EMAIL_OR_PASSWORD_WRONG)
            }

            req.user = user

            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: { min: 6, max: 20 },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      }
    },
    ['body']
  )
)

// check schema register
export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NAME_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NAME_STRING
        },
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: USER_MESSAGE.USER_NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const isEmailExists = await userService.checkEmailExists(value)

            if (isEmailExists) {
              throw new Error(USER_MESSAGE.EMAIL_EXISTS)
            }

            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_REQUIRED
        },
        isLength: {
          options: { min: 6, max: 20 },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH
        },
        trim: true
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_REQUIRED
        },
        isLength: {
          options: { min: 6, max: 20 },
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_LENGTH
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH)
            }

            return true
          }
        }
      },
      date_of_birth: {
        errorMessage: USER_MESSAGE.DATE_OF_BIRTH_INVALID,
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        // notEmpty: {
        //   errorMessage: USER_MESSAGE.ACCESS_TOKEN_REQUIRED
        // },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: USER_MESSAGE.ACCESS_TOKEN_REQUIRED
              })
            }

            // Bearer <access_token>
            const access_token = value.split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              req.decoded_authorization = decoded_authorization
            } catch (error: any) {
              if (error instanceof ErrorWithStatus) {
                throw error
              }

              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        // notEmpty: {
        //   errorMessage: USER_MESSAGE.REFRESH_TOKEN_REQUIRED
        // },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFRESH_TOKEN_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              // verify refresh token and check refresh token exists in database
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ])

              // check refresh token exists in database
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_NOT_FOUND_OR_USED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              // check refresh token match with user_id
              if (req.decoded_authorization.user_id !== decoded_refresh_token.user_id) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_NOT_MATCH,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              req.decoded_refresh_token = decoded_refresh_token
            } catch (error: any) {
              if (error instanceof ErrorWithStatus) {
                throw error
              }

              // error validation refresh token
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFRESH_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.EMAIL_VERIFY_TOKEN_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            const decoded_verify_email_token = await verifyToken({
              secretKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
              token: value
            })

            req.decoded_verify_email_token = decoded_verify_email_token

            return true
          }
        }
      }
    },
    ['body']
  )
)
