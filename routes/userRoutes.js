import express from "express";
import {
  deleteUser,
  getAllUsers,
  login,
  signUp,
  updateUser,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/allUsers", getAllUsers);
router.delete("/deleteUser/:userId", deleteUser);
router.put("/updateUser/:userId", updateUser);

export default router;
