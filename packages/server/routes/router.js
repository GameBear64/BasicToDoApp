const taskRoutes = require('./Task');

module.exports = function (app) {
  app.use('/task', taskRoutes);
};
