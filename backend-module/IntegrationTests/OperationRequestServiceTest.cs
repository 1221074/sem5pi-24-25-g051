using Xunit;
using Moq;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.UnitTests
{
    public class OperationRequestServiceTests
    {
        private readonly Mock<IOperationRequestRepository> _mockORRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly OperationRequestService _operationRequestService;

        public OperationRequestServiceTests()
        {
            _mockORRepo = new Mock<IOperationRequestRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _operationRequestService = new OperationRequestService(_mockORRepo.Object, _mockUnitOfWork.Object);
        }

        [Fact]
        public async Task GetByIdAsync_OperationRequestExists_ReturnsOperationRequest()
        {
            // Arrange
            var operationRequestId = Guid.NewGuid();
            var operationRequest = new OperationRequest(operationRequestId, "1", "2", "3", DateTime.Now, Priority.Urgent);

            _mockORRepo.Setup(repo => repo.GetByIdAsync(It.Is<OperationRequestId>(id => id.AsGuid() == operationRequestId)))
                       .ReturnsAsync(operationRequest);

            // Act
            var result = await _operationRequestService.GetByIdAsync(new OperationRequestId(operationRequestId));

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequestId, result.Id);
            Assert.Equal(Priority.Urgent.ToString(), result.PriorityState);
        }

        [Fact]
        public async Task AddAsync_ValidOperationRequest_AddsOperationRequest()
        {
            // Arrange
            var creatingRequestDto = new CreatingOperationRequestDto(
                "1", 
                "2", 
                "3", 
                DateTime.Now.AddDays(7), 
                Priority.Urgent.ToString() 
            );

            _mockORRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>()));

            _mockUnitOfWork.Setup(uow => uow.CommitAsync());

            // Act
            var result = await _operationRequestService.AddAsync(creatingRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(creatingRequestDto.PriorityState, result.PriorityState);
        }

        [Fact]
        public async Task UpdateAsync_OperationRequestExists_UpdatesOperationRequest()
        {
            // Arrange
            var operationRequestId = Guid.NewGuid();
            var operationRequestDto = new OperationRequestDto
            {
                Id = operationRequestId,
                PatientId = "1",
                DoctorId = "2",
                OperationTypeId = "3",
                DeadlineDate = DateTime.Now.AddDays(10),
                PriorityState = Priority.Elective.ToString()
            };

            var existingRequest = new OperationRequest(operationRequestId, "1", "2", "3", DateTime.Now, Priority.Urgent);

            _mockORRepo.Setup(repo => repo.GetByIdAsync(It.Is<OperationRequestId>(id => id.AsGuid() == operationRequestId)))
                       .ReturnsAsync(existingRequest);

            _mockUnitOfWork.Setup(uow => uow.CommitAsync());

            // Act
            var result = await _operationRequestService.UpdateAsync(operationRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequestDto.Id, result.Id);
            Assert.Equal(Priority.Elective.ToString(), result.PriorityState);
        }

        [Fact]
        public async Task DeleteAsync_OperationRequestExists_DeletesOperationRequest()
        {
            // Arrange
            var operationRequestId = Guid.NewGuid();
            var operationRequest = new OperationRequest(operationRequestId, "1", "2", "3", DateTime.Now, Priority.Urgent)
            {
                Active = false 
            };

            _mockORRepo.Setup(repo => repo.GetByIdAsync(It.Is<OperationRequestId>(id => id.AsGuid() == operationRequestId)))
                       .ReturnsAsync(operationRequest);

            _mockUnitOfWork.Setup(uow => uow.CommitAsync());

            // Act
            var result = await _operationRequestService.DeleteAsync(new OperationRequestId(operationRequestId));

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequestId, result.Id);
        }
    }
}
