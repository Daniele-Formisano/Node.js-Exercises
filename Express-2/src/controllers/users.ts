import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

const logIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await db.one(
      "SELECT * FROM users WHERE username=$1",
      username
    );

    if (user && user.password === password) {
      const payload = { id: user.id, username };
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("secret non valido");
      }
      const token = jwt.sign(payload, jwtSecret);

      await db.none("UPDATE users SET token=$2 WHERE id=$1", [user.id, token]);

      res.status(200).json({ id: user.id, username, token });
    } else {
      res.status(400).json({ msg: "username or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: "errore del server" });
  }
};

export { logIn };
