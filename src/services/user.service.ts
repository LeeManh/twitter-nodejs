import User from '~/models/schemas/User.schema'
import { databaseService } from './database.service'
import { TRegisterUser } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
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
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.REFRESH_TOKEN },
      options: {
        expiresIn: process.env.EXP_REFRESH_TOKEN
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private async signTokens(user_id: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return { accessToken, refreshToken }
  }

  private async signVerifyEmailToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.VERIFY_EMAIL_TOKEN },
      options: {
        expiresIn: process.env.EXP_EMAIL_VERIFY_TOKEN
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }

  async register(payload: TRegisterUser) {
    const user_id = new ObjectId()

    // sign verify email token
    const email_verify_token = await this.signVerifyEmailToken(user_id.toString())

    // save user to database
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: email_verify_token as string,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // sign access token and refresh token
    const { accessToken, refreshToken } = await this.signTokens(user_id.toString())

    // save refresh token to database
    await databaseService.refreshTokens.insertOne(new RefreshToken({ token: refreshToken as string, user_id }))

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

  async verifyEmail(user_id: string) {
    const updateEmailVerifyToken = databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
          updated_at: new Date()
        }
      }
    )
    const [{ accessToken, refreshToken }] = await Promise.all([this.signTokens(user_id), updateEmailVerifyToken])

    return {
      accessToken,
      refreshToken
    }
  }
}

export const userService = new UserService()
