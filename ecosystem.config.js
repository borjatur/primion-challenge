module.exports = {
  apps : [{
    name: "api-gateway-service",
    script: "npm",
    cwd: "./api-gateway-service",
    args: "run start:dev"
  }, {
    name: "users-service",
    script: "npm",
    cwd: "./users-service",
    args: "run start:dev"
  }, {
    name: "departments-service",
    script: "npm",
    cwd: "./departments-service",
    args: "run start:dev"
  }]
}
