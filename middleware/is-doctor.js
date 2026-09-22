const isDoctor = (req, res, next) => {
  if (req.session.user.role ==='doctor') return next();
  res.redirect("/auth/sign-in");
};

module.exports = isDoctor;
