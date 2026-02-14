import JWT from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = decoded;
            console.log("Decoded token:", decoded);
            next();
        });
    } else {
        return res.status(403).json({ message: "Authorization header missing or invalid" });
    }
}

export default verifyToken;