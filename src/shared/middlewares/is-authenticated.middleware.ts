import { NextFunction, Response, Request } from "express";
import passport from "passport";

export const isAuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.user = user; // Attach the user object to the request
    next();
  })(req, res, next);
};
