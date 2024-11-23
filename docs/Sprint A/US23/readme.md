# US 023

As an Admin, I want to list/search operation types, so that I can see the details,
edit, and remove operation types.

## 1. Context

This User Story was introduced in Sprint A

## 2. Requisitos


**US 023** As an Admin, I want to list/search operation types, so that I can see the details,
edit, and remove operation types.

### 2.1. Dependências encontradas
> **5.1.20 (Create Operation Types):**  It is logically necessary that a operation type must exist before it can be listed. Therefore, 5.1.23 directly depends on the successful implementation of 5.1.20, where an admin initially adds the operation type.

> **5.1.21 (Edit Operation Type):**  You should be able to edit a operation type when selecting that option on the operation type list.

> **5.1.22 (Delete Operation Types):**  You should be able to delete a operation type when selecting that option on the operation type list.

### 2.2. Critérios de aceitação


* Admins can search and filter operation types by name, specialization, or status
(active/inactive).
* The system displays operation types in a searchable list with attributes such as name, required
staff, and estimated duration.
* Admins can select an operation type to view, edit, or deactivate it.



## 3. Análise

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain model; use case diagrams, etc.),*

### 3.1. Respostas do cliente


>   **Question:** The next one is about User Story 23, which states that the admin can choose an operation to load one of the specific actions, with the specified action. With that in mind, should the removal or any other type of operation type action be accessible only through this method? Or can there be another way to remove or update any type of operation?
>
>   **Answer:** I don't understand the question, but I think I understand what you are saying. So think about 5.1.23 from a user experience, user interface perspective. In terms of the API, if that's what you're talking about, yes, you need something that lets you search, and then you need something in the API that lets you edit, and you need something in the API that lets you remove an operation type. I think that was your question, right?



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