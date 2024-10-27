# US 5.1.12

## 1. Context

*This user story is part of the back-office module for managing hospital staff, enabling administrators to create and register new staff profiles in the system. Admins can input essential details, including contact information, specialization, and assign unique identifiers. This process ensures that each new staff member is accurately added to the hospital roster and granted role-based access permissions.*

## 2. Requirements

*This section details the functionality being developed, outlines dependencies, and highlights any additional specifications.*

**5.1.12: As an Admin, I want to create a new staff profile, so that I can add them to the hospital’s roster.**

**Acceptance Criteria:**
- Admins can input staff details such as first name, last name, contact information, and specialization.
- A unique staff ID (License Number) is generated upon profile creation.
- The system ensures that the staff’s email and phone number are unique.
- The profile is stored securely, and access is based on role-based permissions.

**Dependencies/References:**

> - 


## 3. Analysis

### 3.1. Client's clarifications

*Here, we will outline the client's clarifications, including questions and answers, regarding this User Story.*

>**Q: Do nurses have specializations like doctors?**
> <br> A: Yes, nurses can have specializations, which are important for specific surgeries. (Answered on 2024.09.27)

>**Q: Can a user have both patient and healthcare staff profiles?**
> <br> A: No, a user cannot have both profiles. Staff and patients have separate identifications. (Answered on 2024.09.27)

>**Q: Are healthcare staff IDs unique across roles?**
> <br> A: Yes, staff IDs are unique and not role-specific (e.g., a doctor and nurse can share the same ID format). (Answered on 2024.09.28)

>**Q: Will there be a list of specializations in the system?**
> <br> A: Yes, a predefined list of specializations will be provided, but the system should allow for future additions. (Answered on 2024.09.28)

>**Q: Gostaria de saber se é objetivo o sistema diferenciar as especializações para cada tipo de staff. (...)**
> <br> A: Specializations are independent of whether the professional is a doctor or nurse. (Answered on 2024.10.04)

>**Q: Médicos e enfermeiros podem ter apenas uma especialidade ou podem ser especialistas em várias?**
> <br> A: A doctor or nurse can have only one specialization. (Answered on 2024.10.04)

>**Q: Can a doctor have more than one Expertise?**
> <br> A: No. Consider only one specialization per doctor. (Answered on 2024.10.07)

>**Q: Chapter 3.2 says that "Backoffice users are registered by the admin in the IAM through an out-of-band process", but US 5.1.1 says that "Backoffice users are registered by an Admin via an internal process, not via self-registration." Can you please clarify if backoffice users registration uses the IAM system?**
> <br> A: What this means is that backoffice users cannot self-register in the system like the patients do. (...) (Answered on 2024.10.07)

>**Q: How should the specialization be assigned to a staff? Should the admin write it like a first name? Or should the admin select the specialization?**
> <br> A: The system has a list of specializations. Staff is assigned a specialization from that list. (Answered on 2024.10.08)

>**Q: Good afternoon, regarding the specializations, do doctors, nurses, and technicians share the same group of specializations, or does each type of professional have distinct, role-specific specializations?**
> <br> A: They share the same set of specializations.

>** **
> <br>

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

**Teste 1:** *Verifies that the staff is created successfully.*

```
    [Fact]
    public async Task CreateAsync_CreatesAndReturnsStaff()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staffDto = new StaffDto("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Staff>())).ReturnsAsync(staff);
        
        // Act
        var result = await _service.AddAsync(staffDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Person1", result.FirstName);
    }
```

## 5. Implementação

**Commits Relevantes**