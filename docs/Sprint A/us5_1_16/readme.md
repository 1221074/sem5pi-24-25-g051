# US5_1_16

As a Doctor, I want to request an operation.

## 1. Context

As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.

## 2. Requirements

### 2.1. Dependencies Found

- This User Story has a dependency on US5_1_1.

### 2.2. Acceptance Criteria

- Doctors can create an operation request by selecting the patient, operation type, priority, and 
suggested deadline. 
- The system validates that the operation type matches the doctor’s specialization. 
- The operation request includes: - Patient ID - Doctor ID - Operation Type - Deadline - Priority 
- The system confirms successful submission of the operation request and logs the request in 
the patient’s medical history. 

## 3. Analysis

*In this section, the team should report the study/analysis/comparison that was done in order to take the best design decisions for the requirement. This section should also include supporting diagrams/artifacts (such as domain models, use case diagrams, etc.).*

### 3.1. Customer Feedback

>**Question:** "Does the system adds automically the operation request to the medical history of the patient?"
>
>**Answer:** "no need. it will be the doctor's responsibility to add it"

>**Question:** "Can a doctor make more than one operation request for the same patient? If so, is there any limit or rules to follow? For example, doctors can make another operation request for the same patient as long as it's not the same operation type?"
>
>**Answer:** "it should not be possible to have more than one "open" surgery request (that is, a surgery that is requested or scheduled but not yet performed) for the same patient and operation type."

>**Question:** "When the doctor is creating the operation request, which data fields should be selectable, and which data fields should require manual input?"
>
>**Answer:** "if a field is a reference to another concept, from an usability perspective, the user should not be forced to enter the value manually but should be allowed to select it or search and select it.follow your common sense PS: remember that in this sprint you are developing an API. this question is more related to the usability of the user interface. From the API perspective it doesn't matter how the value was collected from the user"

### 3.2. System Sequence Diagram (Level 1 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-request-level-1.svg)

### 3.3. System Sequence Diagram (Level 2 - Process View)

![System Sequence Diagram](IMG/system-sequence-diagram-operation-request-level-2.svg)

## 4. Design

*In this section, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rationale behind the applied design patterns, and the specification of the main tests used to validate the functionality.*

### 4.1. Sequence Diagram (Level 3 - Process View)

![Sequence Diagram](IMG/sequence-diagram-operation-request-level-3.svg)

### 4.2. Tests

**Test 1:** *Verifies that only the requesting doctor can update the operation request.*

```java
@Test(expected = UnauthorizedAccessException.class)
public void ensureOnlyRequestingDoctorCanUpdateRequest() {
    OperationService.updateOperationRequest(otherDoctorId, requestId, newDetails);
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

To integrate the operation request functionality with the other parts of the system, we performed the following steps:

-Ensured that only the doctor who requested the operation has permission to modify it, preventing unauthorized changes.
-Implemented logging for all changes to operation requests for traceability and auditing.

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*


To demonstrate the functionality, you must follow the steps below:

-Log in as a Doctor and access the operation request.
-Create a new operation request for a patient.
-Check the database to ensure that the operation was properly recorded.

## 7. Observações

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*