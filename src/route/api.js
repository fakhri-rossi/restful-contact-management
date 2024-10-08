import express from "express";
import userController from "../controllers/user-controller.js";
import contactController from "../controllers/contact-controller.js";
import addressController from "../controllers/address-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Contact API
userRouter.post("/api/contacts", contactController.create);
userRouter.get("/api/contacts/:contact_id", contactController.get);
userRouter.put("/api/contacts/:contact_id", contactController.update);
userRouter.delete("/api/contacts/:contact_id", contactController.remove);
userRouter.get("/api/contacts/", contactController.search);

// Address API
userRouter.post("/api/contacts/:contact_id/addresses", addressController.create);
userRouter.get("/api/contacts/:contact_id/addresses/:address_id", addressController.get);
userRouter.put("/api/contacts/:contact_id/addresses/:address_id", addressController.update);
userRouter.delete("/api/contacts/:contact_id/addresses/:address_id", addressController.remove);
userRouter.get("/api/contacts/:contact_id/addresses", addressController.list);

export { userRouter };
