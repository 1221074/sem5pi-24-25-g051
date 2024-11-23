# US5_1_17

As a Doctor, I want to update an operation requisition.

## 1. Context

As a Doctor, I want to update an operation requisition, so that the Patient has access to the necessary healthcare.

## 2. Requirements

### 2.1. Dependencies Found

- This User Story has a dependency on US5_1_1.
- This User Story has a dependency on US5_1_16.


### 2.2. Acceptance Criteria

1. Doctors can update operation requests they created (e.g., change the deadline or priority).
2. The system checks that only the requesting doctor can update the operation request.
3. The system logs all updates to the operation request (e.g., changes to priority or deadline).
4. Updated requests are reflected immediately in the system and notify the Planning Module of any changes.

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "Operation Requests have, at least, an ID, a Patient, an Operation Type, a Doctor, a Deadline Date, and a Priority. Considering the previous answer, the doctor cannot change the Patient ID but can change the Priority. Besides the Priority, could the doctor also update the Deadline Date or Operation Type?"
>
>**Answer:** "the answer was about operation requests, not operation types. I believe the term "operation time" in the original answer was the reason for this misunderstanding, as it means the expected deadline for the request, not the duration.thus, the doctor can change the deadline, the priority, and the description. the doctor cannot change the operation type nor the patient"

>**Question:** "Hello Mr. Client, you want to log all updates to the operation request. Do you plan to have this info available in the app or is this just for audit purposes ?"
>
>**Answer:** "the history of the operation type definition is part of the application's data. if the user needs to view the details of an operation that was performed last year, they need to be able to see the operation configuration that was in place at that time"

### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-update-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-update-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-operation-update-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that only the requesting doctor can update the operation requisition.*

```java
@Test(expected = UnauthorizedAccessException.class)
public void ensureOnlyRequestingDoctorCanUpdateRequisition() {
    OperationService.updateOperationRequisition(otherDoctorId, requisitionId, updatedDetails);
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

To integrate the operation requisition update functionality with the other parts of the system, we performed the following steps:

-Ensured secure update permissions so that only the requesting doctor can modify an operation requisition.
-Conectivity with the database to ensure safe updates.

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

To demonstrate the functionality, follow these steps:

-Log in as a Doctor and access the operation requisition.
-Update an existing operation requisition that you have created (e.g., change priority or deadline).
-Check the notification sent to the Planning Module to ensure the updates were properly communicated.
-Attempt to modify another doctor's requisition to confirm that the system enforces permissions, expecting an "Unauthorized" error.
-Inspect the real-time update of the requisition in the system, confirming that the changes are immediately visible.

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*