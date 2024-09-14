import jwt from "jsonwebtoken";

const JWT_SECRET = "JISD3VAd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GenerateTokenAdmin = (adminEmail: string): string => {
  return jwt.sign({ adminEmail}, JWT_SECRET, { expiresIn: "5d" });
};

const verifyTokenAdmin = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export { GenerateTokenAdmin, verifyTokenAdmin };
