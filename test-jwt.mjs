import { SignJWT } from "jose";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

const secretStr = process.env.ACCESS_TOKEN_SECRET;
// console.log("Secret from .env:", secretStr);

const payload = {
  userId: "test-user",
  role: "ADMIN",
  name: "Test User",
  email: "test@example.com",
  status: "ACTIVE",
  isDeleted: false,
  emailVerified: true,
};

// Sign with jsonwebtoken
const jsonwebtokenToken = jwt.sign(payload, secretStr, { expiresIn: "1d" });
// console.log("\nToken signed with jsonwebtoken:", jsonwebtokenToken);

// Try verifying with jsonwebtoken
try {
  const verifiedJwt = jwt.verify(jsonwebtokenToken, secretStr);
  // console.log("jsonwebtoken Verify SUCCESS:", verifiedJwt.userId);
} catch (e) {
  console.error("jsonwebtoken Verify ERROR:", e.message);
}

// Try verifying with jose
try {
  const secretKey = new TextEncoder().encode(secretStr);
  const { payload: verifiedJose } = await jwtVerify(
    jsonwebtokenToken,
    secretKey,
  );
  // console.log("jose Verify SUCCESS:", verifiedJose.userId);
} catch (e) {
  console.error("jose Verify ERROR:", e.code, e.message);
}
