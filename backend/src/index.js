const { createApp } = require('./app');
const env = require('./config/env');

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`Northstar backend listening on port ${env.PORT}`);
});
