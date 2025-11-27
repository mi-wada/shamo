.PHONY: preview_openapi
preview_openapi:
	@docker run \
		--rm \
		-p 8080:8080 \
		-e SWAGGER_JSON=/openapi.yaml \
		-v $(PWD)/docs/openapi.yaml:/openapi.yaml \
		swaggerapi/swagger-ui:latest
