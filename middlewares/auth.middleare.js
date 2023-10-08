import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken';

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthenticated, please login again', 401));
    }

    try {
        const userDetails = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        next();
    } catch (error) {
        // Handle token verification errors
        return next(new AppError('Invalid token, please login again', 401));
    }
};

const authorizedRoles = (...roles) => async(req,res,next)=>{
    const currentUserRoles= req.user.role;
    if(!roles.includes(currentUserRoles)){
        return next(
            new AppError('You do not have permission to use this routes',403)
        )
    }
}

const authorizeSubscriber = async(req,rez,next)=>{
    const subscription = req.user.subscription;
    const currentUserRoles = req.user.role;
    if(currentUserRoles!== 'ADMIN'&& subscription.status!== 'active'){
        return next(
            new AppError('Please subscribe to access this route!',403)
        )
    }

}

export {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber

};
