---
title: Architecture
description: Description of the system architecture
layout: ../../layouts/MainLayout.astro
---

The system will have two components to enable the exploration of an architecture
that aims to enable team autonomy, technical scalability and optimise for
delivery flow.

<div style="text-align: center;">

```plantuml
!include <C4/C4_Container>

Person(customer, "Customer", "Person interested in coffee")
Container(simple_store, "Simple store", "next.js", "Allows customers to find, learn and buy coffee")
Container(coffee_store, "Coffee store", "spring boot (java)", "All the coffee information")

Rel(customer, simple_store, "uses", "browser")
Rel(simple_store, coffee_store, "gets info from", "https")
```

</div>

## The roles

The **Simple store** is a customer-focused application, meaning it is the
closest to the customer. Its focus is to deliver the best experience to the
end-user as possible with minimum worry on breaking any of the business rules.

Now, **Coffee store** is a business-focused service, meaning it encapsulates the
business rules about the business take on the coffee knowledge. It makes all the
information available to any consumer to build upon.

## What is covered?

1. Application architecture, deployment and testing
    * [Simple store](../en/nextjs/service)
    * [Coffee store](../en/java-spring/service)
2. Collaboration between the components

