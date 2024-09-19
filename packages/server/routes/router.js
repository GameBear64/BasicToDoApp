const { checkAuth } = require('../middleware/auth');

const authRoutes = require('./Auth');
const userRoutes = require('./User');
const taskRoutes = require('./Task');

module.exports = function (app) {
  app.use('/auth', authRoutes);
  app.use(checkAuth);

  app.use('/user', userRoutes);
  app.use('/task', taskRoutes);
};
