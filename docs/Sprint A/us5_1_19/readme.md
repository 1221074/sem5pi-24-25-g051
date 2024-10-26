# US5_1_19

As a Doctor, I want to list/search operation requisitions.

## 1. Context

As a Doctor, I want to list/search operation requisitions, so that I can see the details, edit, and remove operation requisitions.

## 2. Requirements

### 2.1. Dependencies Found

- This User Story has a dependency on US5_1_1.
- This User Story has a dependency on US5_1_16.

### 2.2. Acceptance Criteria

1. Doctors can search operation requests by patient name, operation type, priority, and status.
2. The system displays a list of operation requests in a searchable and filterable view.
3. Each entry in the list includes operation request details (e.g., patient name, operation type, status).
4. Doctors can select an operation request to view, update, or delete it.

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "When listing operation requests, should only the operation requests associated to the logged-in doctor be displayed?"
>
>**Answer:** "a doctor can see the operation requests they have submitted as well as the operation requests of a certain patient.an Admin will be able to list all operation requests and filter by doctor it should be possible to filter by date of requeste, priority and expected due date"

### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-search-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-search-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-operation-search-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that the system can filter operation requests by patient name.*

```java
@Test
public void ensureSystemCanFilterByPatientName() {
    List<OperationRequisition> results = OperationService.searchByCriteria("patientName", "John Doe");
    assertFalse(results.isEmpty());
    assertEquals("John Doe", results.get(0).getPatientName());
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

To integrate the list/search functionality with other parts of the system, we performed the following steps:

-Developed a method that supports searching and filtering of operation requisitions.

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

To demonstrate the functionality, follow these steps:

-Log in as a Doctor and access the operation requisition.
-Use the search filters (e.g., patient name, operation type, priority, and status) to find specific operation requisitions.

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*