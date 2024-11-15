# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Generate a self-signed certificate for HTTPS in the build stage
RUN dotnet dev-certs https --clean  # Clean any old certs
RUN dotnet dev-certs https --trust  # Generate a new cert and trust it

# Use a lightweight runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Copy prebuilt files into the image
ARG PUBLISH_DIR=publish
COPY $PUBLISH_DIR .

# Expose the port the app runs on
EXPOSE 80
ENTRYPOINT ["dotnet", "sem5pi-24-25-g051.dll"]
