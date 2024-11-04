using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using backend_module.Controllers;
using backend_module.Models.OperationType;
using backend_module.Models.Shared;

public class OperationTypeControllerTests
{
    private readonly OperationTypeService _service;
    private readonly OperationTypeController _controller;
    private readonly Mock<IOperationTypeRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public OperationTypeControllerTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IOperationTypeRepository>();
        _service = new OperationTypeService(_repositoryMock.Object, _unitOfWorkMock.Object);
        _controller = new OperationTypeController(_service);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOkResult_WithAllOperationTypes()
    {
        // Arrange
        var operationTypes = new List<OperationType>
        {
            new OperationType ("Type1",new List<Guid>(), "1 hour" ),
            new OperationType ("Type2",new List<Guid>(), "2 hours" )
        };
         _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        
        var returnValue = Assert.IsType<List<OperationTypeDTO>>(result.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
         var operationType = new OperationType("Type1",new List<Guid>(), "1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);

        // Act
        var result = await _controller.GetByIdAsync(operationType.Id.AsGuid());

        // Assert
        var returnValue = Assert.IsType<OperationTypeDTO>(result.Value);
        Assert.Equal("Type1", returnValue.Name);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNotFound_WhenNotFound()
    {
        // Arrange
         var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(id))).ReturnsAsync((OperationType)null);

        // Act
        var result = await _controller.GetByIdAsync(id);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task CreateAsync_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var operationTypeDto = new CreatingOperationTypeDTO("Type1", new List<Guid>(), "1 hour");
        var operationType = new OperationType("Type1",new List<Guid>(), "1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OperationType>())).ReturnsAsync(operationType);

        // Act
        var result = await _controller.Create(operationTypeDto);

        // Assert
       
        var returnValue = Assert.IsType<OperationTypeDTO>(result.Value);
        Assert.Equal("Type1", returnValue.Name);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
        var operationType = new OperationType ("Type1",new List<Guid>(),"1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
        var operationTypeDto = new OperationTypeDTO { Id = operationType.Id.AsGuid(), Name = "UpdatedType", RequiredStaff = new List<Guid>(), Duration = "2 hours" };

        // Act
        var result = await _controller.Update(operationType.Id.AsGuid(),operationTypeDto);

        // Assert
        var returnValue = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("UpdatedType", ((OperationTypeDTO)returnValue.Value).Name);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNotFound_WhenNotFound()
    {
        // Arrange
        var operationTypeDto = new OperationTypeDTO { Id = Guid.NewGuid(), Name = "Type1", RequiredStaff = new List<Guid>(), Duration = "1 hour" };
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(operationTypeDto.Id))).ReturnsAsync((OperationType)null);

        // Act
        var result = await _controller.Update(operationTypeDto.Id, operationTypeDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsBadRequest_WhenIdMismatch()
    {
        // Arrange
        var operationTypeDto = new OperationTypeDTO { Id = Guid.NewGuid(), Name = "Type1", RequiredStaff = new List<Guid>(), Duration = "1 hour" };

        // Act
        var result = await _controller.Update(Guid.NewGuid(), operationTypeDto);

        // Assert
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task SoftDeleteAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
       var operationType = new OperationType ("Type1",new List<Guid>(),"1 hour" );
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);

        // Act
        var result = await _controller.SoftDelete(operationType.Id.AsGuid());

        // Assert
        Assert.NotNull(result);
        Assert.False(operationType.Active);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task SoftDeleteAsync_ReturnsNotFound_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(id))).ReturnsAsync((OperationType)null);

        // Act
        var result = await _controller.SoftDelete(id);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task HardDeleteAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
        var operationType = new OperationType("Type1", new List<Guid>(), "1 hour");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(operationType.Id)).ReturnsAsync(operationType);
        await _controller.SoftDelete(operationType.Id.AsGuid());
        // Act
        var result = await _controller.HardDelete(operationType.Id.AsGuid());

        // Assert
        var returnValue = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Type1", ((OperationTypeDTO)returnValue.Value).Name);
    }

    [Fact]
    public async Task HardDeleteAsync_ReturnsNotFound_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(id))).ReturnsAsync((OperationType)null);

        // Act
        var result = await _controller.HardDelete(id);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}