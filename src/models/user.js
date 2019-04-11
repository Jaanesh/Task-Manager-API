const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const TaskModel=require('../models/task');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.trim().toLowerCase().includes('password')){
                throw new Error('password should not contain a word password');
            }
        }
    },
    email:{
       type:String,
       required:true,
       trim:true,
       lowercase:true,
       unique:true,
       validate(value){           
               if(!validator.isEmail(value)){
                   throw new Error('invalid Email');
               }           
       }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
        
    
},{
    timestamps:true
});


// 'tasks' is not a actual field.It is a virtual field for mongoose to provide relationship
// Below statement says that '_id' of User has relationship with 'owner' field of Task model
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
});


// toJSON will be called whenever we are trying to stringfying the object,so while sening response
// we are trying to stringify the response object at tht time the below method gets called
userSchema.methods.toJSON=function (){
    const user=this;

    const userObject=user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}



userSchema.methods.generateAuthToken= async function(){
      const user=this;
      const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);

      user.tokens=user.tokens.concat({token});

      //console.log('token='+token);
      //console.log(user);

      await user.save();

      return token;
}

userSchema.statics.findByCredentails=async (email,password)=>{

    //console.log('email='+email);

    const user=await User.findOne({email});

   // console.log('user='+user);

    if(!user){
        throw Error('Unable to login');
    }

    const isMatch=await bcrypt.compare(password,user.password);

   // console.log('isMatch='+isMatch);

    if(!isMatch){
        throw Error('Unable to login');
    }

    return user;

}

//hash the password
userSchema.pre('save',async function(next){
    let user=this;

    //isModified will be true whenever user is created or updating the password
    if( user.isModified('password') ){
        user.password=await bcrypt.hash(user.password,8);
    }

    //next says that we are done and to proceed further
    next();
});

//remove all the tasks belongs to particular user when his account gets removed
userSchema.pre('remove',async function(next){
    let user=this;

    //remove all the tasks that belongs to user
    await TaskModel.deleteMany({owner:user._id});

    //next says that we are done and to proceed further
    next();
});

const User=mongoose.model('User',userSchema);

module.exports=User;
