import express from "express";
import authenticate from "../lib/authenticate";
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

router.post("/login", login);

router.use(authenticate);

router.get("/", getUserDetails);

router.delete("/", deleteUser);

router.patch("/", updateUser);

router.delete("/login", logout);

export default router;
