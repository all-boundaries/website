---
title: Coffee store (spring/java)
description: Business-focused service encapsulating the domain knowledge 
layout: ../../../layouts/MainLayout.astro
---

## Context

This will go through the whole process of setting the project up and creating
the components based on the problems to be solved. The design and boundaries
conversation will happen as the service evolves.

## Purpose

**Coffee store** is responsible for capturing and surfacing all boundaries' take
on coffee knowledge and enable consumers to view and adjust as needed.

## Building the service

> _The code for this service is [here][repo], in case you are looking for the
> current working state._

### Requirements

To follow this page starting from the bootstrap, you will need to have the
following dependencies installed in your machine.

* [Gradle][gradle]
* [Java][java]

### Project bootstrap

This uses Gradle's built-in `init` command to generate all the necessary
boilerplate.

As you go through, look at `Enter selection` sections to see which options were
selected for each of the steps.

```bash
gradle init
```

```sh
Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 2

Select implementation language:
  1: C++
  2: Groovy
  3: Java
  4: Kotlin
  5: Scala
  6: Swift
Enter selection (default: Java) [1..6] 3

Split functionality across multiple subprojects?:
  1: no - only one application project
  2: yes - application and library projects
Enter selection (default: no - only one application project) [1..2] 2

Select build script DSL:
  1: Groovy
  2: Kotlin
Enter selection (default: Groovy) [1..2] 1
```

### Define the contract

**Coffee store** primary interface is HTTP, see the initial contract
[here][initial_contract] or right below:

<details>
    <summary>API specification (click to expand)</summary>

```yaml
openapi: 3.0.3
info:
  title: Coffee bags
  description: |-
    A place with information about each coffee bag and their beans
  contact:
    email: coffeebags@examaple.org
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  version: "202211051316"
servers:
  - url: https://coffeebags.example.org
tags:
  - name: coffee
    description: Everything about coffee
paths:
  /bags:
    get:
      tags:
        - coffee
      summary: All coffee bags
      description: Lists all known coffee bags
      operationId: all-bags
      responses:
        "200":
          $ref: "#/components/responses/CoffeeBagsResponse"
components:
  schemas:
    CoffeeBag:
      type: object
      properties:
        name:
          type: string
          description: Producer's coffee bag name
          example: Iridescent
        description:
          type: string
          description: Details about the bag
          example: |-
            Includes coffees from Ethiopia, Kenya, and Latin America. It’s a  combination of some of our best, most interesting coffees, and features notes of dark chocolate and berry. Each year, we donate $1 per pound from Iridescent to fund transformative projects in coffee-producing countries through our Seeds fund—a program that awards grants to producer-driven sustainability projects. Because good work, good cheer, and great coffee is more than just a winter theme.
        roasting:
          type: object
          properties:
            profile:
              type: string
              enum:
                - light
                - medium
                - medium-dark
                - dark
              example: Dark
              description: The roasting profile used
            date:
              type: string
              format: date
              description:  When the roasting happened
              example: 2022-11-01
            roster:
              type: string
              format: uri
              description: Link to roster's information
              example: https://coffeebags.example.org/rosters/the-identifier
        weight:
          type: object
          properties:
            unitCode:
              type: string
              description: The unit of measurement given using the UN/CEFACT Common Code (3 characters)
              example: GRM
            unitText:
              type: string
              description: Text indicating the unit of measurement. Useful if you cannot provide a standard unit code for unitCode
              example: g
            value:
              type: number
              description: The value of the weight in the corresponding unit
              example: 340

  responses:
    CoffeeBagsResponse:
      description: |
        Collection with coffee bags or empty `{ "data": [] }`
      content:
        "application/json":
          schema:
            type: object
            properties:
              data:
                description: Standard wrapper property for collection responses
                type: array
                items:
                  $ref: "#/components/schemas/CoffeeBag"
```

</details>

#### How to define

Since **Coffee store** will encapsulate many business rules and already have a
known consumer to collaborate with, here is how the contract came to life.

1. Coffee store's team spent some time with the domain experts
2. Created an API specification draft
3. Shared with the known consumer for initial feedback
4. Agreed that it is a good start

> **Team boundary**
>
> Collaborating on the contract between two groups of people, each with a
> specific responsibility within the larger ecosystem.

[repo]: https://github.com/all-boundaries/coffee-store
[gradle]: https://gradle.org/install
[java]: https://adoptium.net
[initial_contract]: https://github.com/all-boundaries/coffee-store/commit/0cebf4c5d0a6fd3dd927f007c8ed12f2a6b27913
