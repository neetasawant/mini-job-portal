const Job = require("../models/Job")
const Application = require('../models/Applications')
exports.createJob = async(req, res) => {
    console.log('create a job')
    try{
        const {title, description, status} = req.body
        const job = new Job({
            title,
            description,
            status,
            recruiterId: req.user.id
        })
        await job.save()
        res.status(201).json(job)
    }catch(error){
        res.status(500).json({message: 'server error'})
    }
}

exports.getAllJobs = async(req,res) => {
    try{
        const jobs = await Job.find({status: "open"})
        res.status(200).json(jobs)
    }catch(error){
        res.status(500).json({message: "server error"})
    }
}

exports.getJobById = async(req, res) => {
    try{
        const job = await Job.findById(req.params.id)
        if(!job) return res.status(404).json({message:"job not found"})

        res.json(job)
        
    }catch(error){
        res.status(500).json({message: "server error"})
    }
}

exports.updateJob = async(req, res) => {
    console.log('update called', req.params.id)
    try {
        const { title, description } = req.body;
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id, 
            { title, description }, 
            { new: true }
        );
        
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(updatedJob);
    } catch (err) {
        console.error("Error updating job:", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteJob = async(req, res) => {
    try {
        const { id } = req.params;
        await Application.deleteMany({ jobId: id });
        await Job.findByIdAndDelete(id);
    
        res.json({ message: "Job and related applications deleted successfully" });
      } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Failed to delete job" });
      }
}

exports.getJobsByRecruiter = async (req, res) => {
    try {
        const recruiterId = req.user.id; 
        const jobs = await Job.find({ recruiterId });
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
        res.status(500).json({ message: "Server error" });
    }
};

