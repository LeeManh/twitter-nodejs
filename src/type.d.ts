import { Request } from 'express'
import User from './models/schemas/User.schema'
import { ITokenPayload } from './models/requests/User.request'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: ITokenPayload
    decoded_refresh_token?: ITokenPayload
  }
}
