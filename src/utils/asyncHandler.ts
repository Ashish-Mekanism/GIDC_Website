import { Request, Response, NextFunction } from 'express';

type AsyncHandler<R extends Request = Request> = (
  req: R,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const asyncHandler = <R extends Request = Request>(
  requestHandler: AsyncHandler<R>
) => {
  return (req: R, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
