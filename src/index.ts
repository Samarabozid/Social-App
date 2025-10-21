import 'dotenv/config'
import * as express from "express";
import * as controllers from "./Modules/controllers.index";
import { dbConnection } from "./DB/db.connection";
import { NextFunction, Request, Response } from "express";
import { HttpException } from './Utils/index';
import { FailedResponse } from './Utils/Response/response-helper.utils';

const app = express();
app.use(express.json());
dbConnection();

app.use('/api/auth', controllers.authController);
app.use('/api/users', controllers.profileController);
app.use('/api/posts', controllers.postsController);
app.use('/api/comments', controllers.commentsController);
app.use('/api/reacts', controllers.reactsController);

// error handling middleware
app.use((err:HttpException | Error | null, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if(err) {
        if(err instanceof HttpException){
             res.status( err.statusCode).json(FailedResponse(err.message,err.statusCode,err.error))
        }else{
             res.status(500).json(FailedResponse('Something went wrong!',500,err));
        }
    }
});


const port: number | string = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
