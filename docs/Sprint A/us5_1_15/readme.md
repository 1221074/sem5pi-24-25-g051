# US 5.1.15

## 1. Context

*This user story is part of the back-office module for staff management, equipping administrators with tools to list, search, and manage staff profiles effectively. The objective is to deliver a user-friendly interface that enables admins to view detailed staff information, update profiles, and remove inactive profiles as needed. This functionality is crucial for maintaining an organized, accurate, and current hospital staff roster.*

## 2. Requirements

*This section details the functionality being developed, outlines dependencies, and highlights any additional specifications.*

**5.1.15: As an Admin, I want to list/search staff profiles, so that I can see the details, edit, and remove staff profiles.**

**Acceptance Criteria:**
- Admins can search staff profiles by attributes such as name, email, or specialization.
- The system displays search results in a list view with key staff information (name, email, specialization).
- Admins can select a profile from the list to view, edit, or deactivate.
- The search results are paginated, and filters are available for refining the search results.

**Dependencies/References:**

> - 

## 3. Analysis

### 3.1. Client's clarifications

*Here, we will outline the client's clarifications, including questions and answers, regarding this User Story.*

>**Q: Do nurses have specializations like doctors?**
> <br> A: Yes, nurses can have specializations, which are important for specific surgeries. (2024.09.27)

>**Q: Is it mandatory for patients to have a user account to schedule a surgery?**
> <br>A: No, patients are not required to have a user account. The system administrator creates patient profiles. (2024.09.28)

>**Q: Who has the authority to schedule or reschedule surgeries?**
> <br>A: The planning module automatically handles the scheduling, though administrators may trigger a manual update. (2024.09.28)

>**Q: Can users hold multiple roles?**
> <br>A: No, each user can have only one role. (2024.09.28)

>**Q: Are healthcare staff IDs unique across roles? **
> <br> A: Yes, staff IDs are unique and not role-specific.

>**Q: What types of filters can be applied when searching for profiles?**
> <br> A: Filters can include doctor specialization, name, or email to refine search results.

>**Q: Gostaria de saber se é objetivo o sistema diferenciar as especializações para cada tipo de staff. (...)**
> <br> A: Specializations are independent of whether the professional is a doctor or nurse. (Answered on 2024.10.04)

>**Q: As discussed in a class, there are plenty of filters for the doctors' profiles, however, I'm struggling to see what filters can be applied to the patients' profiles listing. (...)**
> <br> A: Users should be able to search patients by: name, AND/OR email, AND/OR phone number (...) (Answered on 2024.10.07)

>**Q: Good afternoon, regarding the specializations, do doctors, nurses, and technicians share the same group of specializations, or does each type of professional have distinct, role-specific specializations?**
> <br> A: They share the same set of specializations.

>**Can a doctor haver more than one Expertise?**
> <br> A: no. consider only one specialization per doctor.

> **Q: Hello Mr. Client. The filters are And or OR. For example, if I filter for a Patient named John and Age 24, do you want every John who is 24 years old or every Patient who is called John or is 24 years old?**
>  <br>A: If more than one search/filter parameter is used, the combination of filters should be considered as AND. (Answered on 2024.10.08)

> **Q: Good afternoon, regarding the specializations, do doctors, nurses, and technicians share the same group of specializations, or does each type of professional have distinct, role-specific specializations? Could you clarify how these specializations are categorized?**
> <br>A: They share the same set of specializations. (Answered on 2023.10.07)

>** **
> <br> 

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

**Teste 1:** *Verifies that all staffs are returned.*

```
    [Fact]
    public async Task GetAllAsync_ReturnsAllStaff()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff ("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff ("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Person1", result[0].FirstName);
        Assert.Equal("Person2", result[1].FirstName);
    }

```

**Teste 2:** *Verifies that it filters by ID.*

```
    [Fact]
    public async Task GetByIdAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByIdAsync(staff.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Person1", result.FirstName);
    }

```

**Teste 3:** *Verifies that it returns null if the ID is not found.*

```
    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new StaffId(id))).ReturnsAsync((Staff)null);

        // Act
        var result = await _service.GetByIdAsync(new StaffId(id));  

        // Assert
        Assert.Null(result);
    }
```

**Teste 4:** *Verifies that it filters by the first name.*

```
    [Fact]
    public async Task GetByFirstNameAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByFirstNameAsync("Person1");

        // Assert
        Assert.Single(result);
        Assert.Equal("Person1", result[0].FirstName);
    }

```

**Teste 5:** *Verifies that it returns empty the first name is not found.*

```
    [Fact]
    public async Task GetByFirstNameAsync_ReturnsEmptyList_WhenNotFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByFirstNameAsync("NonExistentName");

        // Assert
        Assert.Empty(result);
    }

```

**Teste 6:** *Verifies that it filters by email.*

```
    [Fact]
    public async Task GetByEmailAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByEmailAsync("person1@isep.ipp.pt");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("person1@isep.ipp.pt", result.Email);
    }

```

**Teste 7:** *Verifies that it returns null when the email is not found.*

```
    [Fact]
    public async Task GetByEmailAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByEmailAsync("nonexistent@isep.ipp.pt");

        // Assert
        Assert.Null(result.Email);
    }

```

**Teste 8:** *Verifies that it filters by the last name.*

```
    [Fact]
    public async Task GetByLastNameAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByLastNameAsync("LastName1");

        // Assert
        Assert.Single(result);
        Assert.Equal("LastName1", result[0].LastName);
    }

```

**Teste 9:** *Verifies that it return empty if the last name is not found.*

```
    [Fact]
    public async Task GetByLastNameAsync_ReturnsEmptyList_WhenNotFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByLastNameAsync("NonExistentLastName");

        // Assert
        Assert.Empty(result);
    }
```

**Teste 10:** *Verifies that it filters by the full name.*

```
    [Fact]
    public async Task GetByFullNameAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByFullNameAsync("Person1 LastName1");

        // Assert
        Assert.Single(result);
        Assert.Equal("Person1 LastName1", result[0].FullName);
    }
```

**Teste 11:** *Verifies that it returns empty when the full name is not found.*

```
    [Fact]
    public async Task GetByFullNameAsync_ReturnsEmptyList_WhenNotFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByFullNameAsync("NonExistent FullName");

        // Assert
        Assert.Empty(result);
    }
```

**Teste 12:** *Verifies that it filters by phone number.*

```
    [Fact]
    public async Task GetByPhoneAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByPhoneAsync("123456789");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("123456789", result.Phone);
    }
```

**Teste 13:** *Verifies that it returns null when the phone number is not found.*

```
    [Fact]
    public async Task GetByPhoneAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var spec = new Specialization("doctor");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _service.GetByPhoneAsync("000000000");

        // Assert
        Assert.Null(result.Phone);
    }
```

**Teste 14:** *Verifies that it filters by specialization.*

```
    [Fact]
    public async Task GetBySpecializationAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var specId = Guid.NewGuid();
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", specId, "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", specId, "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);
    
        // Act
        var result = await _service.GetBySpecializationAsync(specId);
    
        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Person1", result[0].FirstName);
        Assert.Equal("Person2", result[1].FirstName);
    }
```

**Teste 15:** *Verifies that it returns empty when the specialization is not found.*

```
    [Fact]
    public async Task GetBySpecializationAsync_ReturnsEmptyList_WhenNotFound()
    {
        // Arrange
        var specId = Guid.NewGuid();
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", Guid.NewGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", Guid.NewGuid(), "person2@isep.ipp.pt", "987654321")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);
    
        // Act
        var result = await _service.GetBySpecializationAsync(specId);
    
        // Assert
        Assert.Empty(result);
    }
```
