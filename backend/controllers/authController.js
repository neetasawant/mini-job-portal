const Users = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    console.log('register')
    try{
        const { name, email, password, role} = req.body
        if(!name || !email || !password || !role) return res.status(400).json({message:"All fields required"})
        
        //check if user exists
        const userAvailable = await Users.findOne({email})
        if(userAvailable) return res.status(400).json({message:"User already exists"})

        const user = new Users({name, email, password, role})
        await user.save()

        res.status(201).json({message: "User registered successfully"})
    }catch(error){
        res.status(500).json({message: "Server error", error})
    }
}

exports.login = async(req, res) => {
    try{
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid credentials"})

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) return res.status(400).json({message: "Invalid credentials"})

        const token = jwt.sign({id: user._id, name: user.name, role: user.role},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.json({token, user: {id: user._id, name: user.name, email: user.email, role: user.role}})
    }catch(error){
        res.status(500).json({message: "sserver error", error})
    }
}