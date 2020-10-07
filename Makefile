dev:
	docker-compose build --force-rm && docker-compose up -d

importbackup:
	docker build -t importbackup -f ./mongoimport/Dockerfileimport ./mongoimport
	docker run --network host importbackup

exportbackup:
	docker build --force-rm -t exportbackup -f ./mongoimport/Dockerfileexport ./mongoimport
	docker run --network host -v $(PWD)/mongoimport/mybackups:/mybackups -it exportbackup

clean:
	docker-compose down --rmi all -v --remove-orphans