module-create:
	nest g resource modules/$(name) --no-spec
generate-migration:
	npx sequelize-cli migration:generate --name $(name)
db-migrate:
	docker compose exec app npx sequelize-cli db:migrate
db-undo:
	docker compose exec app npx sequelize-cli db:migrate:undo