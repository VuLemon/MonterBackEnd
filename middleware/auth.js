const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT = process.env.JWT_SECRET

exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        const decodedToken = jwt.verify(token, JWT); // verify the JWT associated with the request. See if it the currently logged in user
        
        // Attach the user ID to the request object
        req.userId = decodedToken.userId;
        
        next();
      } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
      }
};




