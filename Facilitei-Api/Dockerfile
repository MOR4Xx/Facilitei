FROM maven:3.9-amazoncorretto-21 AS build
WORKDIR /app
COPY ../pom.xml .
COPY ../src ./src
RUN mvn clean package -DskipTests

FROM openjdk:22-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]