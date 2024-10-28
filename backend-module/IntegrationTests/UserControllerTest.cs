using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using sem5pi_24_25_g051.Controllers;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.User;

public class UserControllerTest
{
    private readonly UserService _service;
    private readonly UserController _controller;
    private readonly Mock<IUserRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;

    public UserControllerTest()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IUserRepository>();
        _service = new UserService(_unitOfWorkMock.Object, _repositoryMock.Object);
        _controller = new UserController(_service);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOkResult_WithAllUser()
    {
        // Arrange
        var users = new List<User>
            {
                new User("g@gmail.com", "User1", "123456789", RoleType.ADMIN, "222256391"),
                new User("h@gmail.com", "User2", "987654321", RoleType.DOCTOR, "222256391")
            };

            _repositoryMock.Setup(repo => repo.GetAllAsync())
                     .ReturnsAsync(users);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("g@gmail.com", result[0].Email);
            Assert.Equal("h@gmail.com", result[1].Email);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsOkResult_WhenFound()
    {
        // Arrange
        var user = new User("123@isep.ipp.pt", "username1", "123456789", RoleType.ADMIN, "123456789");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);

        // Act
        var result = await _controller.GetByIdAsync(user.Id.Value);

        // Assert
        var okResult = result.Result as OkObjectResult;
        var userDto = okResult.Value as UserDto;
        Assert.Equal("username1", userDto.UserName);
    }

}