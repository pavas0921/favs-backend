import express from "express";
import { getAllFavs } from "../controllers/fav.controller.js";
import { createFav } from "../controllers/fav.controller.js";
import { getOneFav } from "../controllers/fav.controller.js";
import { updateFav } from "../controllers/fav.controller.js";
import { deleteFav } from "../controllers/fav.controller.js";
import { verifyToken } from "../controllers/fav.controller.js";
const router = express.Router();

//Get all favs
router.get("/", verifyToken, getAllFavs);

//get Fav by id
router.get("/:id", verifyToken, getOneFav);

//Crear Fave
router.post("/", verifyToken, createFav);

//Update Fav
router.put("/:id", verifyToken, updateFav);

//Delete Fav
router.delete("/:id", verifyToken, deleteFav);

export default router;
