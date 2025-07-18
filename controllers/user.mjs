import { readFile, writeFile } from "node:fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db.mjs";
import { error } from "node:console";
import * as z from "zod";

// input model for user registration
const UserModel = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s]*$/, "Name cannot contain special characters"),
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const registerController = async (req, res, next) => {
  // input check
  try {
    await UserModel.parseAsync(req.body);
  } catch (e) {
    res.statusCode = 400;
    const msg = z.prettifyError(e);
    return res.json({ error: msg });
  }

  // hash password of user
  const newHashedPassword = await bcrypt.hash(req.body.password, 10);

  // add  user in db
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: newHashedPassword,
    },
  });
  // send response
  res.json({ message: "register successful" });
};

// input model for user login
const UserLoginModel = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 8 characters long" }),
});

const loginController = async (req, res, next) => {
  const result = await UserLoginModel.safeParseAsync(req.body);
  if (!result.success) {
    res.statusCode = 400;
    const msg = z.prettifyError(result.error);
    return res.json({ error: msg });
  }

  // find user in db
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    res.statusCode = 400;
    return res.json({ error: "password is wrong" });
  }

  // match password
  const isOk = await bcrypt.compare(req.body.password, user.password);
  if (!isOk) {
    res.statusCode = 404;
    return res.json({ error: "password is wrong" });
  }
  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, name: user.name, email: user.email });
};

export { registerController, loginController };
