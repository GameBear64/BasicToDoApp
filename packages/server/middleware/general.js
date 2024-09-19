exports.getCookies = (req, res, next) => {
  const cookie = req.headers.cookie;

  if (cookie) {
    req.cookies = Object.fromEntries(cookie?.split('; ')?.map(c => c.split('=')));
  }

  next();
};
