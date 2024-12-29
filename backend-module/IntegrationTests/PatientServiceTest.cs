/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using backend_module.Models.Patient;
using backend_module.Models.Shared;

public class PatientServiceTests
{
    private readonly Mock<IPatientRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly PatientService _service;

    public PatientServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repositoryMock = new Mock<IPatientRepository>();
       
        _service = new PatientService(_repositoryMock.Object, _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllPatients()
    {
        // Arrange
        var patients = new List<Patient>
        {
            new Patient ("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123"),
            new Patient ("J", "S", "J S", "1/08/2003", "M", "1001@isep.ipp.pt", "1231", "1231")
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(patients);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("José", result[0].FirstName);
        Assert.Equal("J", result[1].FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsPatient_WhenFound()
    {
        // Arrange
        
        var patient = new Patient ("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(patient.Id)).ReturnsAsync(patient);

        // Act
        var result = await _service.GetByIdAsync(patient.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("José", result.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _ = _repositoryMock.Setup(repo => repo.GetByIdAsync(new PatientId(id))).ReturnsAsync((Patient)null);

        // Act
        var result = await _service.GetByIdAsync(new PatientId(id));  

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsPatient()
    {
        // Arrange
        var patientDTO = new CreatingPatientDTO("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        var patient = new Patient("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        _repositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).ReturnsAsync(patient);

        // Act
        var result = await _service.AddAsync(patientDTO);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("José", result.FirstName);
    }


    [Fact]
    public async Task UpdateAsync_UpdatesAndReturnsPatient_WhenFound()
    {
        // Arrange
        
        
        var patient = new Patient("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        patient.Active = true;
        _repositoryMock.Setup(repo => repo.GetByIdAsync(patient.Id)).ReturnsAsync(patient);
        var patientDTO = new PatientDTO { Id = patient.Id.AsGuid(), FirstName = "José_update", LastName = "Sá", FullName = "José Sá", BirthDate = "19/08/2004", Sex = "M", Email = "100@isep.ipp.pt", Phone = "123", EmergencyContact = "123", AllergyList = [], AppointmentList = []};

        // Act
        var result = await _service.UpdateAsync(patientDTO);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("José_update", result.FirstName);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task InactivateAsync_InactivatesAndReturnsPatient_WhenFound()
    {
        // Arrange
    
        var patient = new Patient("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(patient.Id)).ReturnsAsync(patient);

        // Act
        var result = await _service.InactivateAsync(patient.Id);

        // Assert
        Assert.NotNull(result);
        Assert.False(patient.Active);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeletesAndReturnsPatient_WhenFound()
    {
        // Arrange
       
        var patient = new Patient("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");
        _repositoryMock.Setup(repo => repo.GetByIdAsync(patient.Id)).ReturnsAsync(patient);
        await _service.InactivateAsync(patient.Id);
        // Act
        var result = await _service.DeleteAsync(patient.Id);

        // Assert
        Assert.NotNull(result);
        _repositoryMock.Verify(repo => repo.Remove(patient), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Exactly(2));
    }



}*/