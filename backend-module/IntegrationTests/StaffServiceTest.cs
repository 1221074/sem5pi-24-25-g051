using Moq;
using Xunit;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Specialization;

public class StaffServiceTest
{
    private readonly Mock<IStaffRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly StaffService _service;

    public StaffServiceTest()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IStaffRepository>();
        _service = new StaffService(_unitOfWorkMock.Object, _repositoryMock.Object);   
    }

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


}

