# US5_2_2

As a Backoffice User (Admin, Doctor, Nurse, Technician), I want to reset my password if I forget it.

## 1. Context

As a Backoffice User (Admin, Doctor, Nurse, Technician), I want to reset my password if I forget it, so that I can regain access to the system securely.

## 2. Requirements

### 2.1. Dependencies Found

- There's a dependency on 5_1_1 which creates the users

### 2.2. Acceptance Criteria

- Backoffice users can request a password reset by providing their registered email.
- The system sends a password reset link via email.
- The reset link expires after a predefined period (e.g., 24 hours) for security reasons.
- Users must provide a new password that meets the system’s password complexity rules.

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "Se não existe login com password por exemplo com a autenticação google a us 5.1.2 As a Backoffice User (Admin, Doctor, Nurse, Technician), I want to reset my password if I forget it, so that I can regain access to the system securely, não faz sentido certo?"
>
>**Answer:** "certo. esse requisito aplica-se apenas se usarem um IAM interno"

>**Question:** "How will the system handle expired reset links?"
>
>**Answer:** "The system will notify the user that the link has expired and prompt them to initiate a new password reset request."

### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-password-reset-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-password-reset-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-password-reset-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that the reset link expires correctly after the predefined period.*

```java
@Test(expected = LinkExpiredException.class)
public void ensureResetLinkExpiresAfter24Hours() {
    PasswordResetService.resetPassword("expired-link-token");
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

To integrate the password reset functionality with the other parts of the system, we performed the following steps:

-Integration with the email service in order to have the capability of changing the password.
-The policy is integrated with the google policy for setting passwords

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

To demonstrate the functionality, you must follow the steps below:

-Go to the login page and click "Forgot Password."
-Enter the registered email address and submit the request.
-Check the email for the password reset link and click it.
-Enter and confirm the new password, adhering to the complexity requirements.
-Verify that a confirmation email is received after the password reset is successful.