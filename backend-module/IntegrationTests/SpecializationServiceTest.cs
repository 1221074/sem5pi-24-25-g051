using Moq;
using Xunit;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Specialization;

public class SpecializationServiceTest
{
    private readonly Mock<ISpecializationRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly SpecializationService _service;

    public SpecializationServiceTest()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<ISpecializationRepository>();
        _service = new SpecializationService(_unitOfWorkMock.Object, _repositoryMock.Object);   
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllSpecialization()
    {
        // Arrange
        var specs = new List<Specialization>
        {
            new Specialization ("Doctor"),
            new Specialization ("Nurse"),
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specs);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Doctor", result[0].SpecializationName);
        Assert.Equal("Nurse", result[1].SpecializationName);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsStaff_WhenFound()
    {
        // Arrange
        var spec = new Specialization("Doctor");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(spec.Id)).ReturnsAsync(spec);

        // Act
        var result = await _service.GetByIdAsync(spec.Id.AsGuid());

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Doctor", result.SpecializationName);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new SpecializationId(id))).ReturnsAsync((Specialization)null);

        // Act
        var result = await _service.GetByIdAsync(new SpecializationId(id).AsGuid());  

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsSpecialization()
    {
        // Arrange
        var spec = new Specialization("Doctor");
        var specDto = new CreatingSpecializationDto("Doctor");
        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Specialization>())).ReturnsAsync(spec);
        
        // Act
        var result = await _service.AddAsync(specDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Doctor", result.SpecializationName);
    }


    [Fact]
    public async Task UpdateAsync_UpdatesAndReturnsStaff_WhenFound()
    {
        // Arrange
        
        var spec = new Specialization("Doctor");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(spec.Id)).ReturnsAsync(spec);
        var specDto = new SpecializationDto { Id = spec.Id.AsGuid(), SpecializationName = "UpdatedName"};

        // Act
        var result = await _service.UpdateAsync(specDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("UpdatedName", result.SpecializationName);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeletesAndReturnsOperationType_WhenFound()
    {
        // Arrange
        var spec = new Specialization("Doctor");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(spec.Id)).ReturnsAsync(spec);
        // Act
        var result = await _service.DeleteAsync(spec.Id);

        // Assert
        Assert.NotNull(result);
        _repositoryMock.Verify(repo => repo.Remove(spec), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Exactly(1));
    }


}

