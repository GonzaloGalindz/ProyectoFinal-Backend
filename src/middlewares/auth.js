export const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: `No authenticated users` });
  }
  next();
};

export function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res
      .status(400)
      .json({ error: "You do not have the requested permissions to access" });
  }
}

export function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === "user") {
    next();
  } else {
    res
      .status(400)
      .json({ error: "You do not have the requested permissions to access" });
  }
}
