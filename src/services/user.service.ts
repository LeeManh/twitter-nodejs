import User from '~/models/schemas/User.schema'
import { databaseService } from './database.service'
import { TRegisterUser } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USER_MESSAGE } from '~/constants/message'
config()

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.ACCESS_TOKEN },
      options: {
        expiresIn: process.env.EXP_ACCESS_TOKEN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.REFRESH_TOKEN },
      options: {
        expiresIn: process.env.EXP_REFRESH_TOKEN
      }
    })
  }

  private async signTokens(user_id: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return { accessToken, refreshToken }
  }

  async register(payload: TRegisterUser) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()

    const { accessToken, refreshToken } = await this.signTokens(user_id)

    // save refresh token to database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refreshToken as string, user_id: new ObjectId(user_id) })
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async login(user_id: string) {
    const { accessToken, refreshToken } = await this.signTokens(user_id)

    // save refresh token to database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refreshToken as string, user_id: new ObjectId(user_id) })
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })

    return !!user
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })

    return {
      message: USER_MESSAGE.LOGOUT_SUCCESSFUL
    }
  }
}

export const userService = new UserService()
