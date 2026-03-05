module.exports = {
  apps : [{
    name: "ecommerce-backend",
    script: "java",
    args: "-jar /opt/ecommerce/backend/target/ecommerce-0.0.1-SNAPSHOT.jar",
    watch: false,
    autorestart: true,
    env: {
      SERVER_PORT: "5454"
    }
  }]
}
