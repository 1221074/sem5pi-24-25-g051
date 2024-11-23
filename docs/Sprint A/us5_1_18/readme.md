# US5_1_18

As a Doctor, I want to remove an operation requisition.

## 1. Context

As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.

## 2. Requirements

### 2.1. Dependencies Found

- This User Story has a dependency on US5_1_1.
- This User Story has a dependency on US5_1_16.

### 2.2. Acceptance Criteria

1. Doctors can delete their own operation requests if the operation is not yet scheduled.
2. A confirmation prompt is mandatory before the operation request can be deleted.
3. Deleted operation requests are permanently removed from the patient's medical record.
4. The system notifies the Planning Module upon deletion and updates any schedules affected by the removal.

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "Já referiu que os registos do medical record são adicionados manualmente. Apagar esses registos também o deverá ser? Mais especificamente na Us 5.1.18 diz "Once deleted, the operation request is removed from the patient’s medical record and cannot be recovered". Este delete do medical record deverá ser manual ou deverá acontecer ao mesmo tempo do delete do operation request?"
>
>**Answer:** "ver https://moodle.isep.ipp.pt/mod/forum/discuss.php?d=31956#p40557 o sistema nao faz a ligação automatica entre medical history e operation request"

### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-delete-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-delete-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-operation-delete-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that a deletion prompt is shown before an operation request is deleted.*

```java
@Test
public void ensureDeletionPromptIsDisplayed() {
    boolean isPromptDisplayed = OperationService.showDeletionPrompt(operationRequestId);
    assertTrue(isPromptDisplayed);
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

To integrate the operation requisition deletion functionality with the other parts of the system, we performed the following steps:

-Restricted deletion to unscheduled operation requests only.
-Conectivity with the database to ensure safe updates.


*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

To demonstrate the functionality, follow these steps:

-Log in as a Doctor and access the operation requisition.
-Chose an unscheduled operation requisition that you have created and choose to delete it.
-Confirm the deletion.
-Verify that the operation requisition is removed from the patient's medical record and cannot be recovered.
-Attempt to delete a scheduled operation requisition, expecting an error message that prevents the deletion.
-Inspect the database to confirm that the deletion was recorded appropriately.

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*