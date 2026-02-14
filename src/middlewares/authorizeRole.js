const authorizeRoles = (...allowredRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. You are a ${req.user.role}` });
        }
        next();
    }
};

export default authorizeRoles;