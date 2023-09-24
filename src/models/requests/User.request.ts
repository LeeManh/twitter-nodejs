import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export type TRegisterUser = {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface ITokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface IBodyLogout {
  refresh_token: string
}
