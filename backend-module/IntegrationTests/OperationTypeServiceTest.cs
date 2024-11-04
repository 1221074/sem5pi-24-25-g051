using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using backend_module.Models.OperationType;
using backend_module.Models.Shared;

public class OperationTypeServiceTests
{
    private readonly Mock<IOperationTypeRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly OperationTypeService _service;

    public OperationTypeServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IOperationTypeRepository>();
       
        _service = new OperationTypeService(_repositoryMock.Object, _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllOperationTypes()
    {
        // Arrange
        var operationTypes = new List<OperationType>
        {
            new OperationType ("Type1",new List<Guid>(), "1 hour" ),
            new OperationType ("Type2",new List<Guid>(), "2 hours" )
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Type1", result[0].Name);
        Assert.Equal("Type2", result[1].Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsOperationType_WhenFound()
    {
        // Arrange
        
        var operationType = new OperationType("Type1",new List<Guid>(), "1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);

        // Act
        var result = await _service.GetByIdAsync(operationType.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Type1", result.Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(id))).ReturnsAsync((OperationType)null);

        // Act
        var result = await _service.GetByIdAsync(new OperationTypeId(id));  

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsOperationType()
    {
        // Arrange
        var operationTypeDto = new CreatingOperationTypeDTO("Type1", new List<Guid>(), "1 hour");
        var operationType = new OperationType("Type1",new List<Guid>(), "1 hour" );
        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OperationType>())).ReturnsAsync(operationType);

        // Act
        var result = await _service.AddAsync(operationTypeDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Type1", result.Name);
    }


    [Fact]
    public async Task UpdateAsync_UpdatesAndReturnsOperationType_WhenFound()
    {
        // Arrange
        
        
        var operationType = new OperationType ("Type1",new List<Guid>(),"1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
        var operationTypeDto = new OperationTypeDTO { Id = operationType.Id.AsGuid(), Name = "UpdatedType", RequiredStaff = new List<Guid>(), Duration = "2 hours" };

        // Act
        var result = await _service.UpdateAsync(operationTypeDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("UpdatedType", result.Name);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task InactivateAsync_InactivatesAndReturnsOperationType_WhenFound()
    {
        // Arrange
    
        var operationType = new OperationType ("Type1",new List<Guid>(),"1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);

        // Act
        var result = await _service.InactivateAsync(operationType.Id);

        // Assert
        Assert.NotNull(result);
        Assert.False(operationType.Active);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeletesAndReturnsOperationType_WhenFound()
    {
        // Arrange
       
        var operationType = new OperationType ("Type1",new List<Guid>(),"1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
        await _service.InactivateAsync(operationType.Id);
        // Act
        var result = await _service.DeleteAsync(operationType.Id);

        // Assert
        Assert.NotNull(result);
        _repositoryMock.Verify(repo => repo.Remove(operationType), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Exactly(2));
    }



}