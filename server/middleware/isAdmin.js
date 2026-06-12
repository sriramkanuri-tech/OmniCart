export const isAdmin = (req, res, next) => {
  const email = req.headers["x-user-email"] || req.headers["x-admin-email"] || req.headers["email"] || req.query.adminEmail || req.body.adminEmail || req.body.userEmail;
  if (email === "sriramkanuri4@gmail.com") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access only." });
  }
};
