# US 010

As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care.

## 1. Context

This User Story was introduced in Sprint A

## 2. Requisitos


**US 010** As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care.

### 2.1. Dependências encontradas
> **5.1.8 (Create Patient Profile):**  It is logically necessary that a patient profile must exist before it can be deleted. Therefore, 5.1.10 directly depends on the successful implementation of 5.1.8, where an admin initially creates the patient profile.

### 2.2. Critérios de aceitação

## Acceptance Criteria for User Story 5.1.10

*   Admins can search for a patient profile and mark it for deletion.
*   Before deletion, the system prompts the admin to confirm the action.
*   Once deleted, all patient data is permanently removed from the system within a predefined time frame.
*   The system logs the deletion for audit and GDPR compliance purposes.


## 3. Análise

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain model; use case diagrams, etc.),*

### 3.1. Respostas do cliente

>**Question:** When we delete the patient's profile, what is supposed to happen to all the data related to that patient, like operations and requests for operations?
>
>**Answer:** Due to GDPR, data like operations and operation requests cannot be deleted immediately. These records need to be stored for a legally mandated period. After that period, the data can be deleted or anonymized. You should consider how to handle this sensitive information in light of GDPR regulations and define a data retention policy. For example, you might anonymize certain data points while deleting others entirely after the retention period. 

>**Question:** Regarding the deletion of a patient profile and its related data, should the record of the surgery itself be deleted even if it doesn't belong to the user? For example, if a surgery took place on a specific date with certain staff, and later the patient's profile is deleted, should the record of that surgery also be erased?
>
>**Answer:**  This is a complex case that requires careful consideration. Information about surgeries is generally important and has its own legal deadlines for retention. However, the specific details about the patient involved might need to be anonymized or deleted after the legal retention period. You'll need to consider the validity and sensitivity of the information and determine appropriate actions based on GDPR and legal requirements. 



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