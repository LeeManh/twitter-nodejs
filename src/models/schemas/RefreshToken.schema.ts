import { ObjectId } from 'mongodb'

type TRefreshToken = {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId
}

export class RefreshToken {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId

  constructor({ _id, create_at, token, user_id }: TRefreshToken) {
    this._id = _id
    this.create_at = create_at || new Date()
    this.token = token
    this.user_id = user_id
  }
}
