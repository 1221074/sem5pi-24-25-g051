# US 008

As an Admin, I want to create a new patient profile, so that I can register their personal details and medical history.

## 1. Context

This User Story was introduced in Sprint A

## 2. Requisitos


**US 008** As an Admin, I want to create a new patient profile, so that I can register their personal details and medical history.

### 2.1. Dependências encontradas
This user story does not depend on any other.

### 2.2. Critérios de aceitação

The acceptance criteria for this user story are as follows:
* Admins can input patient details such as first name, last name, date of birth, contact information, and medical history.
* A unique patient ID (Medical Record Number) is generated upon profile creation. The format for this ID is YYYYMMnnnnnn, where YYYY and MM are the year and month of registration, and nnnnnn is a sequential number.
* The system validates that the patient’s email and phone number are unique.
* The profile is stored securely in the system, and access is governed by role-based permissions.

* The administrator must create the patient record before the patient can self-register and create their online profile.
* The administrator will be responsible for entering the patient's License Number, which is assigned by the professional guild.
* Dates should be presented to the user in the format defined by the operating system's locale settings. However, since the API is being developed in this sprint, a standard format like ISO 8601 should be used.
* It is not mandatory to create a user account when creating a patient profile. You can choose to create an inactive user account if it simplifies the implementation from a technical perspective.


## 3. Análise

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain model; use case diagrams, etc.),*

### 3.1. Respostas do cliente

> **Question**:  Can a patient self-register in the system without an admin first creating a profile for them?
> 
> **Answer**:  No. A patient cannot self-register without a pre-existing patient record created by an administrator.  The administrator has to create the patient record first, which includes details such as name, contact information, and potentially medical history. Only after this step can the patient self-register and create their online profile.

> **Question**:  What is the purpose of two-factor authentication in patient self-registration?
> 
> **Answer**:  Two-factor authentication is used to enhance security and ensure data integrity during patient self-registration.  When a patient tries to create a user account, the system sends an email to the address registered in their patient profile. This email contains a link that the patient must click to complete the registration process. This mechanism: 
(1) Confirms that the patient has access to the email address associated with their medical record, and
(2) Links the user account with the correct patient record.

> **Question**:  What specific information does an administrator need to enter when creating a patient profile?
> 
> **Answer**:  The administrator needs to input several details when creating a patient profile:
> * First name
>* Last name
>* Date of birth
>* Contact information (email and phone number)
>* Medical history (including potentially past illnesses, allergies, etc.)
>* License Number (assigned by the professional guild)
>* The system will then generate a unique Medical Record Number for the patient.  This number follows the format YYYYMMnnnnnn, where YYYY is the year, MM is the month of registration, and nnnnnn is a sequential number.

> **Question**: Is it required to create a user account for each patient when creating a patient profile?
> 
> **Answer**:  No, creating a user account for a patient profile is not mandatory. The patient may not want to use the online application, in which case only the patient record is necessary. However, if a patient wishes to access the system to view appointments or other information, a corresponding user account will be required.

> **Question**:  What date format should be used for the patient's date of birth?
> 
> **Answer**:  From a usability perspective, the system should display dates to the user in the format specified by their operating system's locale settings.  However, since the current sprint involves developing the API, the date should be stored and processed using a standard format like ISO 8601.


### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-1.svg)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-2.svg)

## 4. Design

*In this sections, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rational behind the applied design patterns and the specification of the main tests used to validade the functionality.*

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

![Diagrama de Sequência](IMG/sequence-diagram-level-3.svg)

### 4.2. Testes

**Teste 1:** *Verifies that it is not possible to create an instance of the Example class with null values.*

```
@Test(expected = IllegalArgumentException.class)
public void ensureNullIsNotAllowed() {
    Example instance = new Example(null, null);
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

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*