const express = require('express')
const router = express.Router()
const {createJob,getAllJobs, getJobById, updateJob, deleteJob, getJobsByRecruiter} = require('../controllers/jobControllers')
const {authMiddleware, recruiterMiddleware} = require('../middlewares/auth')

router.post("/", authMiddleware, recruiterMiddleware, createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", authMiddleware, recruiterMiddleware, updateJob);
router.delete("/:id", authMiddleware, recruiterMiddleware, deleteJob);
router.get("/recruiter/jobs", authMiddleware, getJobsByRecruiter);

module.exports = router;