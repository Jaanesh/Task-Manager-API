const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const taskSchema=mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true    
    },
    isCompleted:{
        type:Boolean,
        default:false
     },
     owner:{
         type:mongoose.Schema.Types.ObjectId ,
         required:true,
         ref:'User'
     }
 },{
     timestamps:true
 });

 //const User=mongoose.model('User',userSchema);

const Task=mongoose.model('Task',taskSchema);

 module.exports=Task;