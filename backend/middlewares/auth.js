const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    if(!token) return res.status(400).json({messagge: 'Not authorised'})
    try{
    const decoded = jwt.verify(token.split(' ')[1],process.env.JWT_SECRET)
    req.user = decoded
    next()
    }catch(error){
        res.status(400).json({messagge: 'Not authorised'})
    }
}

exports.recruiterMiddleware = (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({ message: "Access Denied. Recruiters Only." });
    }
    next();
};

exports.candidateMiddleware = (req, res, next) => {
    if (req.user.role !== "candidate") {
        return res.status(403).json({ message: "Access Denied. Candidates Only." });
    }
    next();
};