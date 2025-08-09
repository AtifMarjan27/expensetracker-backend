import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const verified = jwt.verify(token, "atif@321");
    console.log("verify",verified);
    
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
