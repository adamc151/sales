docker build -t adamc151/sales-client:latest -f ./client/Dockerfile ./client
docker build -t adamc151/sales-api:latest -f ./api/Dockerfile.dev ./api
docker build -t adamc151/sales-nginx:latest -f ./nginx/Dockerfile ./nginx

docker push adamc151/sales-client:latest
docker push adamc151/sales-api:latest
docker push adamc151/sales-nginx:latest