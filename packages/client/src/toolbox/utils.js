export const formatDate = date =>
  new Date(date + '+0000').toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

export const pick = (object, desiredFields) => {
  return Object.assign({}, ...desiredFields.map(field => ([field] in object ? { [field]: object[field] } : {})));
};

export const omit = (object, fieldsToOmit) => {
  return Object.assign(
    {},
    ...Object.keys(object)
      .filter(key => !fieldsToOmit.includes(key))
      .map(key => ({ [key]: object[key] }))
  );
};
