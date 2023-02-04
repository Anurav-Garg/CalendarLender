import express from "express";
import {
  register,
  getUserDetails,
  deleteUser,
  login,
  logout,
  updateUser,
} from "./users/index";

const router: express.Router = express.Router();

router.post("/", register);

router.get("/", getUserDetails);

router.delete("/", deleteUser);

router.patch("/", updateUser);

router.post("/login", login);

router.delete("/login", logout);

export default router;
