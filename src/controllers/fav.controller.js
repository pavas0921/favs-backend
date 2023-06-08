import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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
    res.status(401).send(error);
  }
};

export const getAllFavs = async (req, res) => {
  try {
    const fav = await prisma.fav.findMany();
    if (fav.length >= 1) {
      res.status(200).json(fav);
    } else {
      res.status(204).json({ error: true, messageError: "No content" });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const getOneFav = async (req, res) => {
  const { id } = req.params;

  try {
    const fav = await prisma.fav.findUnique({
      where: {
        favid: +id,
      },
    });
    if (fav && Object.keys(fav).length > 0) {
      res.status(200).json(fav);
    } else {
      res.status(204).json({ error: true, messageError: "No content" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const createFav = async (req, res) => {
  console.log(req.body);
  const { fav_name, fav_description, fav_link, userid, token } = req.body;
  console.log(fav_name);
  try {
    const newfav = await prisma.fav.create({
      data: {
        fav_name: fav_name,
        fav_description: fav_description,
        user_userid: +userid,
        fav_link: fav_link,
      },
    });
    res.status(201).json({ status: 201, data: newfav });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
};

export const updateFav = async (req, res) => {
  try {
    const { id } = req.params;
    const fav = await prisma.fav.update({
      where: {
        favid: +id,
      },
      data: req.body,
    });
    res.status(201).json({ status: 201, data: fav });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

export const deleteFav = async (req, res) => {
  console.log("hola");
  try {
    console.log("hola");
    const { id } = req.params;
    const deleted = await prisma.fav.delete({
      where: {
        favid: +id,
      },
    });
    res.status(201).json({ status: 201, data: deleted });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};
