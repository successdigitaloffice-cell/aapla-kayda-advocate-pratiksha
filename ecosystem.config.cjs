module.exports = {
  apps: [
    {
      name: 'aapla-kayda-legal-agent',
      script: './backend/src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5050
      },
      error_file: './backend/logs/err.log',
      out_file: './backend/logs/out.log',
      log_file: './backend/logs/combined.log',
      time: true,
      exp_backoff_restart_delay: 100
    }
  ]
};
