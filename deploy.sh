#! /bin/bash

docker stop $(docker ps -aq) && docker rm $(docker ps -aq) && docker rmi $(docker images -aq) && docker volume rm $(docker volume ls -qf dangling=true) && docker-compose up
