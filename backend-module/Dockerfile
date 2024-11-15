# Use a lightweight runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Copy the .csproj file specifically from backend-module and restore dependencies
COPY backend-module/*.csproj ./backend-module/
WORKDIR /app/backend-module
RUN dotnet restore

# Copy prebuilt files into the image
ARG PUBLISH_DIR=/app/backend-module/publish
COPY $PUBLISH_DIR .

# Expose the port the app runs on
EXPOSE 80
ENTRYPOINT ["dotnet", "YourAppName.dll"]
