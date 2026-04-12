import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const secret = process.env.ACCESS_TOKEN_SECRET || "";

// console.log("Secret parsed by dotenv:", process.env.ACCESS_TOKEN_SECRET);

const token = jwt.sign({ userId: "123", role: "ADMIN" }, secret, {
  expiresIn: "1h",
});
// console.log("Token generated with jsonwebtoken:", token);

async function verify() {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    // console.log("Token verified successfully with jose:", payload);
  } catch (err: any) {
    console.error("Verification failed:", err.message);
  }
}
verify();
