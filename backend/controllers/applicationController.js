const Application = require("../models/Applications");
const multer = require("multer");
const path = require("path");
const Job = require("../models/Job");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const WordExtractor = require("word-extractor");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir, 
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage }).single("resume");

const applyJob = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: `File upload error: ${err.message}` });

    try {
      const { jobId } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      const resumePath = path.join(uploadDir, req.file.filename);

      const parsedResume = await extractResumeData(resumePath);
      console.log("Parsed Resume:", parsedResume);

      if (!parsedResume.name && !parsedResume.email) {
        fs.unlinkSync(resumePath);
        return res.status(400).json({ message: "Failed to parse resume" });
      }

      const application = new Application({
        candidateId: req.user.id,
        jobId,
        resumeUrl: `/uploads/${req.file.filename}`,
        parsedDetails: parsedResume,
      });

      await application.save();
      res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.error("Error applying:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const extractResumeData = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let text = "";

  try {
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text.replace(/�/g, "").trim();
    } else if (ext === ".docx") {
      const { value } = await mammoth.extractRawText({ path: filePath });
      text = value.trim();
    } else if (ext === ".doc") {
      const extractor = new WordExtractor();
      const doc = await extractor.extract(filePath);
      text = doc.getBody().trim();
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (err) {
    console.error("Error parsing resume:", err);
    return {};
  }

  text = text.replace(/[-•*]\s*/g, "").replace(/\r/g, "").replace(/\s{2,}/g, " ");

  //console.log("Text:", text); 

  const nameMatch = text.match(/(?:Name[:\s]*)?\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})\b/);
  const name = nameMatch ? nameMatch[1].trim() : "Not Found";
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "Not Found";
  const phoneMatch = text.match(/(?:\+91[-.\s]?)?(?:[6789]\d{4}[-.\s]?\d{5}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "Not Found";

  const skillsRegex = /(Technical Skills|Key Skills|Skills)[\s\S]+?(?=\n[A-Z][a-z]*|\n\n|$)/i;
  let skills = [];
  let match = skillsRegex.exec(text);
  
  //console.log("Skills Match:", match);

  if (match) {
    skills = match[0]
      .replace(/(Technical Skills|Key Skills|Skills)[:\s]*/gi, "")
      .replace(/[^\w\s.,:-]/g, "")
      .split(/\n|,|-/) 
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 1);
  }

  //console.log("Skills:", skills);

  return { name, email, phone, skills };
};

const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobs = await Job.find({ recruiterId }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("candidateId", "name email")
      .populate("jobId", "title")
      .select("candidateId jobId resumeUrl status parsedDetails");

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated", application });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const applications = await Application.find({ candidateId })
      .populate("jobId", "title description")
      .select("jobId status resumeUrl parsedDetails");

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyJob,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateApplications,
};
