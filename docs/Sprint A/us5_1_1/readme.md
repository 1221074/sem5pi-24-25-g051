# US5_1_1

As an Admin, I want to register new backoffice users.

## 1. Context

As an Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the backoffice system with appropriate permissions.

## 2. Requirements

### 2.1. Dependencies Found

- There's no dependency in the User Story

### 2.2. Acceptance Criteria

-Backoffice users (e.g., doctors, nurses, technicians) are registered by an Admin via an internal
process, not via self-registration.
-Admin assigns roles (e.g., Doctor, Nurse, Technician) during the registration process.
-Registered users receive a one-time setup link via email to set their password and activate their
account.
-The system enforces strong password requirements for security. - A confirmation email is sent to verify the user’s registration.

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "A palavra-passe que os utilizadores irão definir será para o login no Google IAM (neste caso estamos a usar a IAM do google) ou será uma palavra-passe separada para aceder à aplicação? Se for uma palavra-passe separada, qual é a sua relevância, tendo em conta que o cliente referiu que tanto os backoffice users como os pacientes devem autenticar-se pelo IAM? Além disso, essa palavra-passe será armazenada na base de dados?"
>
>**Answer:** "se estiverem a usar um IAM externo os aspetos de criação/gestão da password são tratados no IAM e não no sistema, pelo que não se aplica receberem um link para configurar a password"

>**Question:** "So should the backoffice user first be registered (by himself) in the IAM and then pass the info (email and password?) to the admin so that he creates his account? Or should he only register himself in the IAM after the admin creates his account in the system and providing the staff user his hospital's email? Can you clarify a little bit more what do you want to see as the process flow"
>
>**Answer:** "in that same clarification https://moodle.isep.ipp.pt/mod/forum/discuss.php?d=31510#p39978 you may find that "The system must allow for an easy configuration of the DNS domain (e.g., environment variable)."

>**Question:** "What does the client define as an out-of-band process?"
>
>**Answer:** "this applies mainly to the use of an external IAM module. it means the creation of the account is done at the IAM, thus is done outside of the system we are building."


### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-user-registration-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-user-registration-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-user-registration-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that only an Admin can register new backoffice users.*

```java
@Test(expected = UnauthorizedAccessException.class)
public void ensureOnlyAdminCanRegisterBackofficeUsers() {
    UserService.registerBackofficeUser(nonAdminUser, newUserDetails);
}
```

## 5. Implementação

*In this section the team should present, if necessary, some evidencies that the implementation is according to the design. It should also describe and explain other important artifacts necessary to fully understand the implementation like, for instance, configuration files.*

*It is also a best practice to include a listing (with a brief summary) of the major commits regarding this requirement.*

...

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/STRING_DA_ISSUE)

*STRING_DA_ISSUE é a String atribuido à issue pelo próprio Jira (por exemplo: S50-30)*

## 6. Integração/Demonstração

*In this section the team should describe the efforts realized in order to integrate this functionality with the other parts/components of the system*

To integrate the registration functionality with the other parts of the system, we performed the following steps:

-Developed a user interface for Admins to register new backoffice users.
-Integrated a email service to handle the sending of setup and confirmation links.
-Implemented logging for auditing purposes to track the registration of new backoffice users.

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

To demonstrate the functionality, follow these steps:

-Log in as an Admin.
-Go to the user registration section
-Enter the user details (e.g., name, email, role) and submit the information.
-Check with the email of the registered user for a one-time setup link.
-Click the verification link in order to activate the account.
-Attempt to register a user without Admin privileges, expecting an error message to prevent unauthorized registration.
-Inspect the database to ensure that the registration was properly recorded and activation was done properly.

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*