const express=require('express');
const router=express.Router();
const TaskModel=require('../models/task');
const auth=require('../middleware/auth');

router.post('/tasks',auth,async (req,res)=>{

    try{
       // let newTask=new TaskModel(req.body);

        let newTask=new TaskModel({
            ...req.body,
            owner:req.user._id
        });

        await newTask.save();
        res.status(201).send(newTask);
    }catch(error){
        res.status(400).send(error)
    }
                                  
}); 

// GET /tasks
// GET /tasks?completed=true/false
//GET  /tasks?limit=10&&skip=20  skip says how many elemetsns to skip
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res)=>{

    try{

        let match={};
        let sort={};

        if(req.query.completed){
            match.isCompleted=req.query.completed==='true';
        }

        if(req.query.sortBy){
            const parts=req.query.sortBy.split(':');           
            sort[parts[0]]=parts[1]!==null && parts[1].trim() ==='desc'?-1:1;
        }

        // There are two ways to get the tasks of a particular user.Below is first approach
        /*  let tasks=await TaskModel.find({owner:req.user._id});
         res.send(tasks); */

         //Below is the another approach to get tasks of a particular user by using the relationship     

          // await req.user.populate('tasks').execPopulate();

          await req.user.populate({
              path:'tasks',
              match,
              options:{
                  limit:parseInt(req.query.limit),
                  skip:parseInt(req.query.skip),
                  sort
              }
          }).execPopulate();

           res.send(req.user.tasks);


    }catch(error){
        res.status(500).send(error);
    }
  
});

router.get('/tasks/:id',auth,async (req,res)=>{   

    try{
        let _id=req.params.id;
        //let task=await TaskModel.findById(_id);

        let task=await TaskModel.findOne({_id,owner:req.user._id});

        //console.log(task);

        if(!task){
              return res.status(404).send();
        }

        res.send(task);

    }catch(error){
        res.status(500).send(error);
    }
  
});

router.patch('/tasks/:id',auth,async (req,res)=>{
    try{
        let _id=req.params.id;
        let objectToBeUpdated=req.body;
     /*    let options={
            new:true,
            runValidators:true
        }

        let task=await  TaskModel.findByIdAndUpdate(_id,objectToBeUpdated,options); */

        //first find the task
       // let task=await  TaskModel.findById(_id);

       let task=await  TaskModel.findOne({_id,owner:req.user._id});

        if(!task){
            return res.status(404).send();
        }

        const elementsToBeUpdated=Object.keys(objectToBeUpdated);

        elementsToBeUpdated.forEach(element => {
            task[element]=objectToBeUpdated[element];
        });

        await task.save();

        res.send(task);
        

    }catch(error){
        res.status(400).send(error);
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        let _id=req.params.id;
        //let task=await  TaskModel.findByIdAndDelete(_id);

        let task=await  TaskModel.findOneAndDelete({_id,owner:req.user._id});

        if(!task){
            return res.status(404).send();
        }

        res.send(task);

    }catch(error){
        res.status(400).send(error);
    }
})

module.exports=router;