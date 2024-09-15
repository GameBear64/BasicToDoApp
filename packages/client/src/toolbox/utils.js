export const formatDate = date =>
  new Date(date).toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
