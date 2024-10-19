# US 011

As an Admin, I want to list/search patient profiles by different attributes, so that I
can view the details, edit, and remove patient profiles.

## 1. Context

This User Story was introduced in Sprint A

## 2. Requisitos


**US 011** As an Admin, I want to list/search patient profiles by different attributes, so that I
can view the details, edit, and remove patient profiles.

### 2.1. Dependências encontradas
> **5.1.8 (Create Patient Profile):**  It is logically necessary that a patient profile must exist before it can be listed. Therefore, 5.1.11 directly depends on the successful implementation of 5.1.8, where an admin initially creates the patient profile.

> **5.1.9 (Edit Patient Profile):**  You should be able to edit a patient profile when selecting that option on the patient list.

> **5.1.10 (Delete Patient Profile):**  You should be able to delete a patient profile when selecting that option on the patient list.

### 2.2. Critérios de aceitação


*   Admins can search patient profiles by various attributes, including name, email, date of birth, or medical record number. 
*   The system displays search results in a list view with key patient information (name, email, date of birth). 
*   Admins can select a profile from the list to view, edit, or delete the patient record. 
*   The search results are paginated, and filters are available to refine the search results. 



## 3. Análise

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain model; use case diagrams, etc.),*

### 3.1. Respostas do cliente


>   **Question:** Professor, the project says that the administrator can list any type of profile and have access to it. Then, it says that he can search for these profiles by name, email, specialization, but there is also mention of filters to refine the results. Can you talk a little bit more about that? Can you tell me what the use case is, please?
>
>   **Answer:** So, I think that’s it. My question was about the filters, these filters called to apply. The filters are the search criteria. So think about it, I want to list everything, so there are no filters. So I want to have a filter where I only list doctors, or only list doctors, or only list doctors who belong to a specialization, whether it’s a doctor or a physician. Or I want to have a combination of that. I want to look for whether this is a doctor or a physician, or what specialization this person is in. Okay, okay. So, this is the kind of filter we want. Right.



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