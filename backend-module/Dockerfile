# Use the official .NET SDK image for .NET 8.0 to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app/backend-module

# Copy the .csproj and restore dependencies
RUN dotnet restore

# Copy the rest of the files and build the project
RUN dotnet publish -c Release -o out

# Generate the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app/backend-module
COPY --from=build-env /app/backend-module/out ./

# Expose the port the app runs on
EXPOSE 80
ENTRYPOINT ["dotnet", "YourAppName.dll"]
