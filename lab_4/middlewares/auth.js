import jsonwebtoken from 'jsonwebtoken';

/** @type {import("express").Handler} */
export default function authMiddleware(req, res, next) {
  const {authorization} = req.headers;
  if (!authorization) {
    res.status(401).json({message: 'unauthorized'});
  }
  try {
    const user = jsonwebtoken.verify(authorization, 'secret');
    req.user = user;
    next();
  } catch (e) {
    console.trace(e);
    res.status(401).json({message: 'unauthorized'});
  }
}
