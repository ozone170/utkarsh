export const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied: No user found' });
    }

    // Support both single role (string) and multiple roles (array)
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    
    next();
  };
};
