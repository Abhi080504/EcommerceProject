FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Use eclipse-temurin (Debian based) instead of failing openjdk
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/ecommerce-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]
