---
title: Persistence
date: 2023-01.01
draft: false
---

{{< diagram name="persistence" >}}

## 1 The persistence boundary

Here you want to guarantee that the code interacting with the external storage
saves and retrieves the information in the way you expect.

This type of test requires the service to connect to an external storage, when
testing you should use the same technology as the one used in the service's
runtime.

## 2 The design

The service example has a dedicated class to abstract the interaction with the
database from the rest of the application. Here that will be the
`CoffeeBagsRepository`.

The first iteration will focus on:

- Representing the schema in code (`Entity`)
- Persisting and retrieving the information (`Repository`)

<details>
    <summary>Click to see the visual representation</summary>

<div style="text-align: center;">
    <ServiceOnePersistenceDesign />
</div>

</details>

### Frameworks used

The example uses:

- [Spring Boot's data JPA][sb_data]
- [Flyway][flyway]
- [Testcontainers][tc] _(which requires Docker)_

## 3 Pre-requisite

### 3.1 Database migration and schema set up

To test this part you need to have a functional database and the ability to
easily perform migrations at any time.

Besides being functional, it needs to be fully automated, so you can create the
tests in your "local environment", rely on the same set up to run the tests in
the delivery pipeline every time a change is pushed.

To do that in Spring Boot with Flyway, you will need the following:

#### 3.1.1 Add dependencies to the build system

```groovy
// File: io.gh.boundaries.coffeestore.java-application-conventions.gradle

dependencies {
    // ... existing dependencies

    implementation('org.springframework.boot:spring-boot-starter-data-jpa')

    implementation('org.flywaydb:flyway-core:9.8.3')

    testImplementation('org.testcontainers:postgresql:1.17.6')
    testImplementation('org.testcontainers:junit-jupiter:1.17.6')
}
```

#### 3.1.2 Create the first database migration

```sql
-- File: app/src/main/resources/db/migration/V1__Add_coffee_bag_table.sql

CREATE TABLE coffee_bag (
    id UUID NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    roasting_profile varchar(50) NOT NULL,
    roasting_date date NOT NULL,
    roasting_vendor VARCHAR(200) NOT NULL,
    weight_code varchar(5) NOT NULL,
    weight_text varchar(50) NOT NULL,
    weight_value numeric NOT NULL
);
```

## 4 Testing

### 4.1 Create the table representation

```java
// File: app/src/main/java/io/gh/boundaries/coffeestore/bag/persistence/CoffeeBagEntity.java

@Entity(name = "coffee_bag")
@AllArgsConstructor
@ToString
public class CoffeeBagEntity {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "roasting_profile", nullable = false)
    private RoastingProfile roastingProfile;

    @Column(name = "roasting_date", nullable = false)
    private LocalDate roastingDate;

    @Column(name = "roasting_vendor", nullable = false)
    private String roastingVendor;

    @Column(name = "weight_code", nullable = false)
    private String weightCode;

    @Column(name = "weight_text", nullable = false)
    private String weightText;

    @Column(name = "weight_value", nullable = false)
    private BigDecimal weightValue;

    private CoffeeBagEntity() {
        this(null, null, null, null, null, null, null, null, null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CoffeeBagEntity that = (CoffeeBagEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

### 4.2 Create the repository

```java
// File: app/src/main/java/io/gh/boundaries/coffeestore/bag/persistence/CoffeeBagsRepository.java

public interface CoffeeBagsRepository extends JpaRepository<CoffeeBagEntity, UUID> {}
```

### 4.3 Configure Testcontainers

```yaml
# app/src/test/resources/application-test.yml

spring:
    datasource:
      url: jdbc:tc:postgresql:15:///coffeebags
      username: user
      password: password
```

```groovy
// File: buildSrc/src/main/groovy/io.gh.boundaries.coffeestore.java-application-conventions.gradle

test {
    systemProperty 'spring.profiles.active', 'test'
    environment = [
            'TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE': '/var/run/docker.sock',
            'DOCKER_HOST': "unix://${System.getenv('HOME')}/.colima/docker.sock"
    ]
}
```

### 4.4 Create the test

```java
// File: app/src/test/java/io/gh/boundaries/coffeestore/bag/persistence/CoffeeBagsRepositoryTest.java

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CoffeeBagsRepositoryTest {
    @Autowired
    CoffeeBagsRepository repository;

    @Test
    void retrievesAllCoffeeBags() throws Exception {
        CoffeeBagEntity coffeeBagEntity = new CoffeeBagEntity(
                UUID.randomUUID(),
                "Iridescent",
                "Includes coffees from Ethiopia, Kenya, and Latin America. It’s a  combination of some of our best, most interesting coffees, and features notes of dark chocolate and berry. Each year, we donate $1 per pound from Iridescent to fund transformative projects in coffee-producing countries through our Seeds fund—a program that awards grants to producer-driven sustainability projects. Because good work, good cheer, and great coffee is more than just a winter theme.",
                RoastingProfile.Dark,
                LocalDate.now().minusDays(2),
                "https://counterculturecoffee.com",
                "GRM",
                "g",
                new BigDecimal("340"));

        repository.saveAll(List.of(coffeeBagEntity));

        assertThat(repository.findAll()).containsOnly(coffeeBagEntity);
    }
}
```

[sb_data]: https://docs.spring.io/spring-boot/docs/2.7.7/reference/html/data.html#data
[flyway]: https://flywaydb.org
[tc]: https://www.testcontainers.org

