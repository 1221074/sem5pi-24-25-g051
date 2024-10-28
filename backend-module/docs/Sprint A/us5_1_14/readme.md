# US 5.1.14

## 1. Context

*This user story is part of the staff management functionality within the back-office module, allowing administrators to deactivate a staff profile. The main objective is to exclude the staff member from the active roster while securely retaining their historical data—such as prior appointments—for future reference and audit compliance. This process maintains data accuracy and supports regulatory and continuity standards.*

## 2. Requirements

*This section details the functionality being developed, outlines dependencies, and highlights any additional specifications.*

**5.1.14: As an Admin, I want to deactivate a staff profile, so that I can remove them from the hospital’s active roster without losing their historical data.**

**Acceptance Criteria:**
- Admins can search for and select a staff profile to deactivate.
- Deactivating a staff profile removes them from the active roster, but their historical data (e.g., appointments) remains accessible.
- The system confirms deactivation and records the action for audit purposes.

**Dependencies/References:**

> - 

## 3. Analysis

### 3.1. Client's clarifications

*Here, we will outline the client's clarifications, including questions and answers, regarding this User Story.*

> **Q: Can you clarify? "Historical data is maintained but new operation requests will use the updated operation type information."**
> <br> A: It means that if an operation type is changed, we need to keep track of its changes. For instance, Operation Type "A" is defined as taking 30 minutes preparation, 1h surgery, and 30 minutes cleaning with a team of 1 doctor with specialization X and one nurse with specialization Y. Some operations are requested, scheduled, and performed based on this definition. After some time, the hospital changes its procedures and defines the operation type "A" as needing 30 min prep, 30 min surgery, and 30 min cleaning, with a team of 3 doctors and one nurse. New operations will be requested, scheduled, and performed using this new definition. However, we need to keep historical data so that if the admin wants to know the details of an operation in the past, the system must show the operation type as it was defined at the time of the operation request. (Answered on 2024.10.08)

>**Q?**
> <br>

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

**Teste 1:** *Verifies that the staff is inactive.*

```
    [Fact]
    public async Task InactivateAsync_InactivatesAndReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

        // Act
        var result = await _service.InactivateAsync(staff.Id);

        // Assert
        Assert.NotNull(result);
        Assert.False(staff.Active);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }
```

**Teste 2:** *Verifies that the staff is deleted.*

```
    [Fact]
    public async Task DeleteAsync_DeletesAndReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);
        await _service.InactivateAsync(staff.Id);
        // Act
        var result = await _service.DeleteAsync(staff.Id);

        // Assert
        Assert.NotNull(result);
        _repositoryMock.Verify(repo => repo.Remove(staff), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Exactly(2));
    }
```
