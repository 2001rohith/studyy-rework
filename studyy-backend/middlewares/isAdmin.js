const User = require('../models/userModel')
const jwt = require("jsonwebtoken")

const isAdmin = async (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json({ message: "Not token at isAdmin" })
    const extractedToken = token.split(" ")[1]

    try {
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ message: "no user at isAdmin" })
        if (user.role !== "admin") return res.status(401).json({ message: "user is not a admin" })
            req.user = user
        console.log("user is a admin")
        next()
    } catch (error) {
        console.log("error from isAdmin")
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = isAdmin