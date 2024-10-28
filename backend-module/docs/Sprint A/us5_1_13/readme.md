# US 5.1.13

## 1. Context

*This user story is part of the staff management module in the back office, providing administrators with the ability to update existing staff profiles as needed. Admins can revise critical information, including contact information, work availability, and area of specialization. The aim is to ensure that staff records remain accurate and current, with all modifications tracked for audit compliance and notifications automatically sent to inform the affected staff members of any updates.*

## 2. Requirements

*This section details the functionality being developed, outlines dependencies, and highlights any additional specifications*

**5.1.13: As an Admin, I want to edit a staff’s profile, so that I can update their information.**

**Acceptance Criteria:**
- Admins can search for and select a staff profile to edit.
- Editable fields include contact information, availability slots, and specialization.
- The system logs all profile changes, and any changes to contact information trigger a confirmation email to the staff member.
- The edited data is updated in real-time across the system.

**Dependencies/References:**

-


## 3. Analysis

### 3.1. Client's clarifications

*Here, we will outline the client's clarifications, including questions and answers, regarding this User Story.*

>**Q: Do nurses have specializations like doctors?**
> <br> A: Yes, nurses can have specializations, which are important for specific surgeries. (2024.09.27)

>**Q: Will there be a list of specializations in the system?**
> <br> A: Yes, a predefined list of specializations will be provided, but the system should allow for future additions. (2024.09.28)

>**Q: Can users hold multiple roles?**
> <br> A: No, each user can have only one role.

>**Q: Gostaria de saber se é objetivo o sistema diferenciar as especializações para cada tipo de staff. (...)**
> <br> A: Specializations are independent of whether the professional is a doctor or nurse. (Answered on 2024.10.04)

>**Q: Médicos e enfermeiros podem ter apenas uma especialidade ou podem ser especialistas em várias?**
> <br> A: A doctor or nurse can have only one specialization. (Answered on 2024.10.04)

>**Q: In this US an admin can edit a user profile. Does the system display a list of all users or the admin searches by ID? Or both?**
> <br> A: This requirement is for the editing of the user profile (...) (Answered on 2024.10.07)

>**Q: Can a doctor have more than one Expertise?**
> <br> A: No. Consider only one specialization per doctor. (Answered on 2024.10.07)

>**Q: How should the specialization be assigned to a staff? Should the admin write it like a first name? Or should the admin select the specialization?**
> <br> A: The system has a list of specializations. Staff is assigned a specialization from that list.

>**Q: Good afternoon, regarding the specializations, do doctors, nurses, and technicians share the same group of specializations, or does each type of professional have distinct, role-specific specializations?**
> <br> A: They share the same set of specializations.

>** **
> <br>

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

**Teste 1:** *Verifies that the updates are stored properly.*

```
    [Fact]
    public async Task UpdateAsync_UpdatesAndReturnsStaff_WhenFound()
    {
        // Arrange
        
        var spec = new Specialization("doctor");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);
        var staffDto = new StaffDto { Id = staff.Id.AsGuid(), FirstName = "UpdatedName", LastName = "LastName1", FullName = "UpdatedName LastName1", SpecializationId = spec.Id.AsGuid(), Email = "person1@isep.ipp.pt", Phone = "123456789" };

        // Act
        var result = await _service.UpdateAsync(staffDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("UpdatedName", result.FirstName);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }
```