# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the .csproj file specifically from backend-module and restore dependencies
COPY backend-module/*.csproj ./backend-module/
WORKDIR /app/backend-module
RUN dotnet restore

# Copy the rest of the files from backend-module and build the project
COPY backend-module/. ./
RUN dotnet publish -c Release -o out

# Generate the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app/backend-module
COPY --from=build-env /app/backend-module/out ./

# Expose the port the app runs on
EXPOSE 80
ENTRYPOINT ["dotnet", "YourAppName.dll"]
