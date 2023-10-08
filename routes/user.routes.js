import { Router } from "express";

import { getProfile,login,logout,register,forgotPassword,resetPassword,changePassword,updateUser } from "../controllers/user.controller.js";
import { isLoggedIn  } from "../middlewares/auth.middleare.js";
import  upload  from "../middlewares/multer.middleware.js"
const router = Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);

//  get isliye hum direct server se hi logout kr skte hai
router.get('/logout',logout);
router.get('/me', isLoggedIn,getProfile);
router.post('/reset',forgotPassword);
router.post('/reset/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword)  //user  ko password pta hai ye case haii pr usko password change krna hai
router.put('/update',isLoggedIn,upload.single("avatar"),updateUser)


export default router;