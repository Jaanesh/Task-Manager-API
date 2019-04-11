const express=require('express');
require('./db/mongoose'); // no need to assign it .. as we just want the to establish db connection

const userRouter=require('./routers/userRouter');
const taskRouter=require('./routers/taskRouter');


const app=express();

const port=process.env.PORT ;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log('server is up on port '+port);
});