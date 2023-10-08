import { Router } from 'express';
import {removeCourse, createCourse, getAllCourses, getLecturesByCourseId,updateCourse,addLectureToCourseById } from '../controllers/course.controller.js';
import { isLoggedIn,authorizeSubscriber } from '../middlewares/auth.middleare.js'; 
import upload from '../middlewares/multer.middleware.js';
import { authorizedRoles} from '../middlewares/auth.middleare.js';

const router = Router();

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),  //image upload
        createCourse 
        );
    




router.route('/:id')
    .get(isLoggedIn  ,authorizeSubscriber, getLecturesByCourseId) // Corrected the middleware function name
    .put(
            isLoggedIn,
            
            authorizedRoles('ADMIN'),
            updateCourse
        )
    .delete(
        isLoggedIn,
        
        authorizedRoles('ADMIN'),
        removeCourse
        );  // id is  most important for delete and update thats why we put here 


        //  for adding or editing lecture description 
    router.route('/:id/lectures')
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),  //image upload

        addLectureToCourseById
    );
// multer is used for image uploading

export default router;
    