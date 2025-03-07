const express = require("express");
const { applyJob, getRecruiterApplications, updateApplicationStatus, getApplicationsByRecruiter,getCandidateApplications } = require("../controllers/applicationController");
const { authMiddleware, recruiterMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, applyJob); 
router.get("/fetchCandidateApplications",authMiddleware,getCandidateApplications)
router.get("/recruiterApplications", authMiddleware, recruiterMiddleware, getRecruiterApplications);
router.put("/:id/status", authMiddleware, recruiterMiddleware, updateApplicationStatus);

module.exports = router;
