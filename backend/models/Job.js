const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title:{type:String,required: true},
    description:{type:String, required:true},
    status: {type: String,enum:["open","close"],default:"open"},
    recruiterId: {type: mongoose.Schema.Types.ObjectId,ref:"Users",required:true}
},{timestamps:true})

module.exports = mongoose.model("Job",JobSchema)