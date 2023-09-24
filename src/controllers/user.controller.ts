import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { IBodyEmailVerifyToken, IBodyLogout, ITokenPayload, TRegisterUser } from '~/models/requests/User.request'
import { userService } from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { databaseService } from '~/services/database.service'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginController = async (req: Request, res: Response) => {
  const { user } = req
  const user_id = user?._id as ObjectId

  const result = await userService.login(user_id?.toString())

  return res.status(200).json({ message: USER_MESSAGE.LOGIN_SUCCESSFUL, data: result })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, TRegisterUser>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  return res.status(200).json({ message: USER_MESSAGE.REGISTER_SUCCESSFUL, data: result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, IBodyLogout>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body

  const result = await userService.logout(refresh_token)

  return res.status(200).json(result)
}

export const emailVerifyTokenController = async (
  req: Request<ParamsDictionary, any, IBodyEmailVerifyToken>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_verify_email_token as ITokenPayload

  // Check user exists
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USER_MESSAGE.USER_NOT_FOUND })
  }

  // Email already verified
  if (user.email_verify_token === '') {
    return res.json({ message: USER_MESSAGE.EMAIL_ALREADY_VERIFIED })
  }

  // Verify email
  const result = await userService.verifyEmail(user_id)

  return res.status(200).json({ message: USER_MESSAGE.VERIFY_EMAIL_SUCCESSFUL, data: result })
}
