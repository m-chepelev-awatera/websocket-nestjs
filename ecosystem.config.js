module.exports = {
  apps: [
    {
      name: 'ws-chat-nestjs',
      script: 'dist/src/main.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
    },
  ],
};
