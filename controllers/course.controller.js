import AppError from "../utils/error.util.js";
import Course from "../models/course.model.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary'

const getAllCourses = async function(req,res,next){
    try{
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success:true,
            message:'All courses',
            courses,
    
        })
    
    

    }catch(e){
        new AppError(e.message)
    }
}
 

const getLecturesByCourseId = async function(req,res,next) {
    try{
        const { id } = req.params;
        // params able to handle different data based on the client's request.
        console.log('Course Id>',id);
        console.log('Course Detail>',course);
        // debug kiye check krrha hu  kyunki send nhi ho rha request
        const course = await Course.findById(id);
        if(!course){
            return next(
                new AppError('Invalid course Id course not found',400)
        
            )

        }


        res.status(200).json({
            success:true,
            message:'Course lectures fetched successfully',
            lectures: course.lectures
    
        });


    }
    catch(e){
        new AppError(e.message,500)

    }

}

const createCourse = async (req,res,next)  => {
    const {titile ,description,category ,createdBy} = req.body;

    if(!title || !description ||!category ||!createdBy){
        return next(
            new AppError('All fields are required',400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category, 
        createdBy,
        thumbnai:{
            public_id:'Dummy',
            secure_url:'Dummy'
        }
    });

    if(!course) {
        return next (
            new AppError('Course could not create,please try again')
        )
    }
    if(req.file){
        try{
            const result = await cloudinary.v2.uoloader.upload(req.file.path,{
                folder:'lms'
            });
            if(result){
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
    
    
    
            }
       
         fs.rm(`uploads/${req.file.filename}`) //for deleting file if exists

    } catch(e){
        return next(
            new AppError('Course could not created , please try again',500)
        )
    }
}

    course.save();
    res.status(200).json({
        success:true,
        message:'Course created successfully',
        
    })

}

const updateCourse = async (req,res,next)  => {

    try{
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set : req.body
            },
            {
                renValidators:true   // check data jo aarha hai sahi hai ya nhi

            }
        );
        if(!course){
        
                return next(
                    new AppError('Course with given id does not exist , please try again',500)
                )
        }
        res.status(200).json({
            success:true,
            message:'Course updated successfully',
            course,
            
        })

    }catch(e){
        return next(
            new AppError('Course could not be updated, please try again',500)
        )
    }

}


const removeCourse = async (req,res,next)  => {
    try{
        const{id }= req.params;
        const course = await Course.findById(id);
        if(!course){
        
            return next(
                new AppError('Course with given id does not exist , please try again',500)
            )
    }
    await Course.findByIdAndDelete(id);
    res.status(200).json({
        success:true,
        message:'Course deleted successfully',
        course,
        
    })




    }catch(e){
        return next(
            new AppError('Course could not be deleted, please try again',500)


        )
    }


}

const addLectureToCourseById = async(req,res,next) => {
    try{

        const { title,description} = req.body;
        const { id } = req.params; //params se id milti hai
        
        if(!title || !description  ){
            return next(
                new AppError('All fields are required',400)
            )
        }
        
    const course = await Course.findById(id);
    if(!course){
        
        return next(
            new AppError('Course with given id does not exist , please try again',500)
            )
        }
        // if course exists then lec info

        const lecturesData = {
            title, 
            description,
            lecture:{}   // ye exist krna chahiye empty
        }

        // for image uploading
        if(req.file) {
            try{
                const result = await cloudinary.v2.uoloader.upload(req.file.path,{
                    folder:'lms'
                });
                if(result){
                    lecturesData.lecture.public_id = result.public_id;   // samejaise uppar kiye the images upload ke liye
                    lecturesData.lecture.secure_url = result.secure_url;  // course ki jagan humara lecture me data chahiye toh woh aaega
                }
           
             fs.rm(`uploads/${req.file.filename}`) //for deleting file if exists
    
        } catch(e){
            return next(
                new AppError('Course could not created , please try again',500)
            )
        }
            

        }

        // nhi likhenenge toh bhi chlega pr check krne ke liye code kahan tk aaya
        // console.log('lectture>',JSON.stringify(lectureData));  

        course.lectures.push(lecturesData)
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success:true,
            message: 'Lecture Successfull added to the course',
            course   // ye course ke andr jaaye isliye likhe
        })
    }catch(e){
        return(
            new AppError(e.message,500)
        )
    }

   

}

export{

    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    removeCourse,
    updateCourse,
    addLectureToCourseById
}

