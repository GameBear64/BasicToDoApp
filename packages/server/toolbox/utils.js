const jwt = require('jsonwebtoken');

exports.createJWTCookie = id => {
  let expireAt = 3 * 30 * 24 * 60 * 60; /*3 months*/
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: expireAt });
};

// CREDIT: https://stackoverflow.com/a/1054862/7149508
exports.slugifyString = text =>
  text
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^\w ]+/g, '')
    ?.replace(/ +/g, '-')
    ?.replace(/[^\x00-\x7F]/g, '')
    ?.substring(0, 200);

// CREDIT: https://stackoverflow.com/a/32402438/7149508
exports.wildcardMatch = (wildcard, str) => {
  let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
  const re = new RegExp(`^${w.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'i');
  return re.test(str);
};

exports.pick = (object, desiredFields) => {
  return Object.assign({}, ...desiredFields.map(field => ([field] in object ? { [field]: object[field] } : {})));
};

exports.omit = (object, fieldsToOmit) => {
  return Object.assign(
    {},
    ...Object.keys(object)
      .filter(key => !fieldsToOmit.includes(key))
      .map(key => ({ [key]: object[key] }))
  );
};
