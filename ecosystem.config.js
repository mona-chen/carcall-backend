module.exports = {
  apps: [
    {
      name: "gmela",
      script: "main.ts",
      interpreter: "npx",
      interpreter_args: "ts-node",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
