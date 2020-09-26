dev:
	docker-compose build --force-rm && docker-compose up

clean:
	docker-compose down --rmi all -v --remove-orphans