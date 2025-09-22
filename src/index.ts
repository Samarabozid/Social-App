import 'dotenv/config'
import express from "express";
import * as controllers from "./Modules/controllers.index.js";
import { dbConnection } from "./DB/db.connection.js";
import { NextFunction, Request, Response } from "express";

const app = express();
app.use(express.json());
dbConnection();

app.use('/api/auth', controllers.authController);
app.use('/api/users', controllers.profileController);
app.use('/api/posts', controllers.postsController);
app.use('/api/comments', controllers.commentsController);
app.use('/api/reacts', controllers.reactsController);

// error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const status = 500;
    const message = 'Something went wrong!';
    console.error(err.stack);
    res.status(status).json({ message:err?.message || message });
});


const port: number | string = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
