
const errorMiddleware = (Err,req,res,next)=>{

    // agr koi error hai toh thik wrna 500 do default isliye likha hai dono
    err.statuscode =err.statuscode || 500;
    err.message =err.message || 'something went wrong';
    

    return res.status(err.statuscode).json({
        success:false,
        message: err.message,
        stack:err.stack        
    })
}

export default errorMiddleware;