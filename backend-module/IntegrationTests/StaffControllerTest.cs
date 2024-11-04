using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using backend_module.Controllers;
using backend_module.Models.Staff;
using backend_module.Models.Shared;
using backend_module.Models.Specialization;

public class StaffControllerTest
{
    private readonly StaffService _service;
    private readonly SpecializationService _specializationService;
    private readonly StaffController _controller;
    private readonly Mock<IStaffRepository> _repositoryMock;
    private readonly Mock<ISpecializationRepository> _specRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public StaffControllerTest()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IStaffRepository>();
        _specRepositoryMock = new Mock<ISpecializationRepository>();
        _service = new StaffService(_unitOfWorkMock.Object, _repositoryMock.Object);
        _specializationService = new SpecializationService(_unitOfWorkMock.Object, _specRepositoryMock.Object);
        _controller = new StaffController(_service, _specializationService);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOkResult_WithAllStaff()
    {
        // Arrange
        var spec = new Specialization("Specialization1");
        var staff = new List<Staff>
        {
            new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789"),
            new Staff("Person2", "LastName2", "Person2 LastName2", spec.Id.AsGuid(), "person2@isep.ipp.pt", "987654321")
        };
         _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staff);

        // Act
        var result = await _controller.GetAllAsync();

        // Assert
        
        var returnValue = Assert.IsType<List<StaffDto>>(result.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
        var spec = new Specialization("Specialization1");
        var staff = new Staff("Person1", "LastName1", "Person1 LastName1", spec.Id.AsGuid(), "person1@isep.ipp.pt", "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

        // Act
        var result = await _controller.GetByIdAsync(staff.Id.AsGuid());

        // Assert
        var returnValue = Assert.IsType<StaffDto>(result.Value);
        Assert.Equal("Person1", returnValue.FirstName);
    }

}