import jwt from "jsonwebtoken";

const JWT_SECRET = "JISD3V";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateToken = (id: any) => {
  return jwt.sign({ userId: id.toString() }, JWT_SECRET, { expiresIn: "5d" });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export { generateToken, verifyToken };
