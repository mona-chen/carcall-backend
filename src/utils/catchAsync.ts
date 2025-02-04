import { Application, NextFunction } from "express";
import { IReq, IRes } from "types/config";

function catchAsync(fn: Function): any {
  return (req: IReq, res: IRes, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export default catchAsync;
