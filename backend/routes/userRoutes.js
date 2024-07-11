import express from 'express';
import { allUsers, authUser, registerUser } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js'

// export const router = express.Router();
export const userRoutes = express.Router();


userRoutes.route('/').post(registerUser).get( protect, allUsers)
userRoutes.post('/login', authUser)



// router.route('/login', authUser).get(() => {

// })

