import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "no se proporciona ningun token" });
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: "no se proporciona ningun token" });
    }
    console.log("Token:", token); // Log the token for debugging
    
    try {        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log the decoded token for debugging
        req.userId = decoded.id; // Ensure userId is set in the request object
        next();
    } catch (error) {
        console.error("Token verification error:", error); // Log the error for debugging
        console.error("Token:", token); // Log the token for debugging
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "El token ha expirado" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido" });
        } else {
            return res.status(401).json({ message: "No autorizado" });
        }
    }
}