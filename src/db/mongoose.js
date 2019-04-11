const mongoose=require('mongoose');
const validator=require('validator');
const UserModel=require('../models/user');
const TaskModel=require('../models/task');
const connectionURL=process.env.MONGODB_URL;

mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useCreateIndex:true
});

 /* UserModel.findByIdAndUpdate('5c99b883ff1259027d2a644d',{age:25})
          .then(user=>{
              return UserModel.countDocuments({age:25});
          })
          .then(count=>console.log(count))
          .catch(error=>{
              console.log(error);
          });

TaskModel.findByIdAndDelete('5c9b996a20f86f36c68f6098')
          .then(()=> TaskModel.find({isCompleted:true}))
          .then((tasks)=>{
              console.log(tasks);
          })
          .catch(error=>console.log(error));  */

/* const updateAgeAndCountUsers=async (id,age)=>{
    let user=await UserModel.findByIdAndUpdate(id,{age});
    let count=await UserModel.countDocuments({age});
    return count;
}

const deleteTaskAndCount=async (id)=>{
    //5c9b996020f86f36c68f6097
    let removedTask=await TaskModel.findByIdAndDelete('5c9b996020f86f36c68f6097');    
    //console.log(removedTask);
    let count=await TaskModel.countDocuments({isCompleted:true});
    return count;
}

deleteTaskAndCount('5c9b996020f86f36c68f6097')
      .then(count=>console.log(count))
      .catch((e)=>console.log(e)); */

/* updateAgeAndCountUsers('5c99b883ff1259027d2a644d',26)
                      .then(count=>console.log(count))
                      .catch(error=>console.log(error)); */

                    
