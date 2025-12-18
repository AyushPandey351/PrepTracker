# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Install CA certificates for SSL
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with SSL settings
ENTRYPOINT ["java", "-Djavax.net.ssl.trustStoreType=JKS", "-jar", "app.jar"]
