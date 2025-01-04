const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const { USER_REFRESH_ACCOUNT_TYPE } = require('google-auth-library/build/src/auth/refreshclient');

const authMiddleware = async(req, res, next) => {
  const token = req.header('Authorization');
  // console.log("token from auth:", token)
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  const bearerToken = token.split(' ')[1]
  // console.log("actual token from auth:",bearerToken)
  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
    // console.log("user from auth", user)
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if(user.isBlocked === true) return res.status(400).json({message:"Your profile has been blocked!"})
    req.user = user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
