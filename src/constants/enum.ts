export enum UserVerifyStatus {
  Unverified = 0, // chưa xác thực email, mặc định = 0
  Verified = 1, // đã xác thực email
  Banned = 2 // bị khóa
}

export enum TokenType {
  ACCESS_TOKEN = 0,
  REFRESH_TOKEN = 1
}
