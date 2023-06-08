import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const passwordValitdation = (password) => {
  const caps = /[A-Z]/g;
  const capsFound = password.match(caps);

  const numbers = /[0-9]/g;
  const numbersFound = password.match(numbers);

  const specialChars = /[^a-zA-Z0-9\s_@]/g;
  const specialCharsFound = password.match(specialChars);

  if (
    capsFound === null ||
    numbersFound === null ||
    specialCharsFound === null
  ) {
    return false;
  } else {
    return true;
  }
};

export const generateToken = (req, res) => {
  try {
    const { user } = req.body;
    const { userid } = user;
    const payload = { userid };
    console.log("payload**", payload);
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    res.status(200).json({ userid, token });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const isValidUser = bcrypt.compareSync(password, user.password);
    if (isValidUser) {
      req.body.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ error: true, message: "User or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const { exp: expDate } = decoded;

    if (Date.now() / 1000 > expDate) {
      res.status(401).send;
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send("no");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    if (user.length >= 1) {
      res.status(200).json(user);
    } else {
      res.status(204).json({ error: true, messageError: "No content" });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userid: +id,
      },
    });
    if (user && Object.keys(user).length > 0) {
      res.status(200).json(user);
    } else {
      res.status(204).json({ error: true, messageError: "No content" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const updateUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    if (passwordValitdation(password)) {
      const { id } = req.params;
      const hash = bcrypt.hashSync(password, 12);
      const user = await prisma.user.update({
        where: {
          userid: +id,
        },
        data: { email, password: hash, first_name, last_name },
      });
      res.json(user);
    } else {
      const error =
        "La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.";
      res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
};

export const deleteUser = async (req, res) => {
  console.log("hola");
  try {
    const { id } = req.params;
    const deleted = await prisma.user.delete({
      where: {
        userid: +id,
      },
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!passwordValitdation(password)) {
      const error = "La contraseña no coumple con los requisitos de seguridad";
      res.status(400).json(error);
    } else {
      console.log("entro al else");
      const hash = bcrypt.hashSync(password, 12);
      console.log("hash", hash);
      const user = await prisma.user.create({
        data: { email, password: hash, first_name, last_name },
      });
      res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
  }
};
