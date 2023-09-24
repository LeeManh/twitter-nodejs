import { Request, Response, NextFunction, RequestHandler } from 'express'

// su dung để bắt error
// neu co error thi next(error) -> gui error ve cho error handler
export const wrapRequestHandler = (fn: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    next(error)
  }
}
