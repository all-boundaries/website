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

[repo]: https://github.com/all-boundaries/coffee-store
[gradle]: https://gradle.org/install
[java]: https://adoptium.net
