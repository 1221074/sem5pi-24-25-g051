FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y curl

ARG PUBLISH_DIR=publish
COPY $PUBLISH_DIR .

EXPOSE 5280 7252
ENTRYPOINT ["dotnet", "sem5pi-24-25-g051.dll"]
