import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/user.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/user.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()

userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default userRouter