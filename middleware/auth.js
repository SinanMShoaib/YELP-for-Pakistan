const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    // In Angular, we will send this as 'Authorization': 'Bearer YOUR_TOKEN'
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied. Please Login to add or rate restaurants." });
    }

    // Split 'Bearer <token>' to get just the token
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        // 2. Verify the token using your secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_TEMPORARY_SECRET');
        
        // 3. Attach the user ID to the request object so routes can see WHO is calling
        req.user = verified;
        
        // 4. Move to the next piece of logic (the actual route)
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid or Expired Token." });
    }
};