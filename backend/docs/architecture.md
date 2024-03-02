# Architecture

## Layer Dependencies

handler -> usecase -> domain

## handler

This layer knows what the external interface is. Specifically, it knows whether it is a REST API, a GraphQL API, a CLI, or something else.

Map external request to the processing of the usecase layer.

## usecase

Combine components of the domain layer to provide processing for realizing the user's use cases.

## domain

This layer contains all the business logic.

### model

Contains concepts dealt with in this system.

### repository

Contains logic for persisting data.
