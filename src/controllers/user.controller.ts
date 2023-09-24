import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { IBodyLogout, TRegisterUser } from '~/models/requests/User.request'
import { userService } from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'

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
