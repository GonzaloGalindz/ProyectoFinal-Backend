import { Router } from "express";
import {
  deleteInactiveUsers,
  deleteUserById,
  getUsers,
  updateRoleUser,
} from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", isAdmin, getUsers);

router.delete("/", isAdmin, deleteInactiveUsers);

router.delete("/:uid", isAdmin, deleteUserById);

router.put("/updateRole/:uid", isAdmin, updateRoleUser);

export default router;
