using Xunit;
using Moq;
using backend_module.Models.User;
using backend_module.Services;
using backend_module.Models.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_module.IntegrationTests
{
    public class UserServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IUserRepository> _mockRepo;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            // Initialize the mocks for dependencies
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockRepo = new Mock<IUserRepository>();

            // Create a real instance of UserService with mocked dependencies
            _userService = new UserService(_mockUnitOfWork.Object, _mockRepo.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfUsers()
        {
            // Arrange
            var users = new List<User>
            {
                new User("g@gmail.com", "User1", "123456789", RoleType.ADMIN, "222256391"),
                new User("h@gmail.com", "User2", "987654321", RoleType.DOCTOR, "222256391")
            };

            _mockRepo.Setup(repo => repo.GetAllAsync())
                     .ReturnsAsync(users);

            // Act
            var result = await _userService.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("g@gmail.com", result[0].Email);
            Assert.Equal("h@gmail.com", result[1].Email);
    
        }

        [Fact]
        public async Task GetByIdAsync_UserExists_ReturnsUser()
        {
            // Arrange
            var userId = "222256391";
            var user = new User("g@gmail.com", "User1", "123456789", RoleType.ADMIN, userId);

            _mockRepo.Setup(repo => repo.GetByIdAsync(It.Is<UserNif>(n => n.Value == userId)))
                     .ReturnsAsync(user);

            // Act
            var result = await _userService.GetByIdAsync(new UserNif(userId));

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Nif);
            Assert.Equal("g@gmail.com", result.Email);
        }

        [Fact]
        public async Task GetByIdAsync_UserDoesNotExist_ReturnsNull()
        {
            // Arrange
            var userId = "222256391";

            _mockRepo.Setup(repo => repo.GetByIdAsync(It.Is<UserNif>(n => n.Value == userId)))
                     .ReturnsAsync((User)null);

            // Act
            var result = await _userService.GetByIdAsync(new UserNif(userId));

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_ValidUser_AddsUser()
        {
            // Arrange
            var creatingUserDto = new CreatingUserDTO { Nif = "232256391", Email = "newuser@gmail.com", UserName = "Test",PhoneNumber = "999999999",Role = RoleType.ADMIN };
            var user = new User(creatingUserDto.Email, "User1", "123456789", RoleType.ADMIN, creatingUserDto.Nif);

            _mockRepo.Setup(repo => repo.GetAllAsync())
                     .ReturnsAsync(new List<User>());

            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<User>()));

            // Act
            var result = await _userService.AddAsync(creatingUserDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(creatingUserDto.Nif, result.Nif);
            Assert.Equal("newuser@gmail.com", result.Email);
    }


        [Fact]
        public async Task CreateAsync_UserWithExistingEmail_ReturnsNull()
        {
            // Arrange
            var creatingUserDto = new CreatingUserDTO {  Nif = "232256391", Email = "existing@gmail.com", UserName = "User2",PhoneNumber = "987654321",Role = RoleType.DOCTOR };
            var existingUsers = new List<User>
            {
                new User("existing@gmail.com", "User2", "987654321", RoleType.DOCTOR, "232256391")
            };

            _mockRepo.Setup(repo => repo.GetAllAsync())
                     .ReturnsAsync(existingUsers);

            // Act
            UserDto result = null;
            try
            {
                result = await _userService.AddAsync(creatingUserDto);
            }
            catch(Exception ex){
                Assert.Equal("User with the same email already exists", ex.Message);
            }

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_ValidUser_UpdatesUser()
        {
            // Arrange
            var userId = "222256391";
            var userDto = new UserDto { Nif = userId, Email = "g@gmail.com",UserName = "Test",PhoneNumber = "999999999",Role = RoleType.ADMIN };
            var user = new User("g@gmail.com", "User1", "123456789", RoleType.DOCTOR, userId);
            user.Active = true;

            _mockRepo.Setup(repo => repo.GetByIdAsync(It.Is<UserNif>(n => n.Value == userId)))
                     .ReturnsAsync(user);

            // Act
            var result = await _userService.UpdateAsync(userDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Nif);
            Assert.Equal("g@gmail.com", result.Email);
        }

        [Fact]
        public async Task UpdateAsync_UserDoesNotExist_ReturnsNull()
        {
            // Arrange
            var userId = "222256391";
            var userDto = new UserDto { Nif = userId, Email = "g@gmail.com", Role = RoleType.ADMIN, UserName = "TESTE", PhoneNumber = "999999999" };

            _mockRepo.Setup(repo => repo.GetByIdAsync(It.Is<UserNif>(n => n.Value == userId)))
                     .ReturnsAsync((User)null);

            // Act
            var result = await _userService.UpdateAsync(userDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SoftDeleteAsync_UserExists_InactivatesUser()
        {
            // Arrange
            var userId = "222256391";
            var user = new User("g@gmail.com", "User1", "123456789", RoleType.ADMIN, userId);
            user.Active = true;

            _mockRepo.Setup(repo => repo.GetByIdAsync(It.Is<UserNif>(n => n.Value == userId)))
                     .ReturnsAsync(user);

            // Act
            var result = await _userService.InactivateAsync(new UserNif(userId));

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Nif);
            Assert.False(user.Active); 
        }

    }
}
