import { readFile, writeFile } from "node:fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db.mjs";
import { error } from "node:console";

const registerController = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.statusCode = 400;
    return res.json({ error: "input is not valid" });
    // throw new Error(JSON.stringify({ error: "input is not valid" }))
  }

  // add  user in db

  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });
  // send response
  res.json({ message: "register successful" });
};

const loginController = async (req, res, next) => {
  // validate input
  if (!req.body.email || !req.body.password) {
    res.statusCode = 400;
    return res.json({ error: "input is not valid" });
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
    return res.json({
      error: "password is wrong",
    });
  }
  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, name: user.name, email: user.email });
};

export { registerController, loginController };
