import { config } from 'dotenv'
import jwt, { JwtPayload, sign } from 'jsonwebtoken'
import { ITokenPayload } from '~/models/requests/User.request'
config()

type TParamSignToken = {
  payload: any
  privateKey?: string
  options?: jwt.SignOptions
}

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: TParamSignToken) => {
  return new Promise((resolve, reject) => {
    sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token)
    })
  })
}

export const verifyToken = ({
  token,
  secretKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretKey?: string
}) => {
  return new Promise<ITokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }

      resolve(decoded as ITokenPayload)
    })
  })
}
