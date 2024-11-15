# Use a lightweight runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Copy prebuilt files into the image
ARG PUBLISH_DIR=publish
COPY $PUBLISH_DIR .

# Expose the port the app runs on
EXPOSE 80 443
ENTRYPOINT ["dotnet", "sem5pi-24-25-g051.dll"]
