const adminMiddleware = (req, res, next) => {
  try {

    if (!req.user) {
    return res.status(401).json({ message: 'No autenticat' });
    }
    const userRole = req.user.rol;
    if (userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'No tens permisos' });
    }
    next();
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminMiddleware;
