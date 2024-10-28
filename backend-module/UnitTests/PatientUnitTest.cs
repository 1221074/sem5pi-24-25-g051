using Xunit;

namespace sem5pi_24_25_g051.UnitTests;
using Models.Patient;
public class PatientUnitTest
{
    [Theory]
    [InlineData("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123")]
    [InlineData("jos", "s", "jos s", "19/08/2003", "M", "1020@isep.ipp.pt", "123", "123")]
    public void WhenPassingCorrectData_ThenPatientIsInstantiated(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact)
    {
        new Patient(firstName, lastName, fullName, birthDate,sex, email, phone, emergencyContact);
    }

    [Theory]
    [InlineData("José", "Sá", "José Sá", "19/08/2004", "M", "wow", "123", "123")]
    [InlineData("jos", "s", "jos s", "19/08/2003", "M", "1020isepippt", "123", "123")]
    public void WhenPassingInvalidEmail_ThenThrowsException(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact)
    {
        Assert.Throws<ArgumentException>(() => new Patient(firstName, lastName, fullName, birthDate,sex, email, phone, emergencyContact));
    }

    [Fact]
    public void WhenPassingName_ShouldGetAttributes()
    {
        // assert
        string firstNameExpected = "José";
        string lastNameExpected = "Sá";
        string fullNameExpected = "José Sá";
        string birthDateExpected = "19/08/2004";
        string sexExpected = "M";
        string emailExpected = "100@isep.ipp.pt";
        string phoneExpected = "123";
        string emergencyContactExpected = "123";
        
        var patient = new Patient("José", "Sá", "José Sá", "19/08/2004", "M", "100@isep.ipp.pt", "123", "123");

        // act
        string GetFirstName = patient.FirstName;
        string GetLastName = patient.LastName;
        string GetFullName = patient.FullName;
        string GetBirthDate = patient.BirthDate;
        string GetSex = patient.Sex;
        string GetEmail = patient.Email;
        string GetPhone = patient.Phone;
        string GetEmergencyContact = patient.EmergencyContact;

        //assert
        Assert.Equal(firstNameExpected, GetFirstName);
        Assert.Equal(lastNameExpected, GetLastName);
        Assert.Equal(fullNameExpected,GetFullName);
        Assert.Equal(birthDateExpected,GetBirthDate);
        Assert.Equal(sexExpected,GetSex);
        Assert.Equal(emailExpected,GetEmail);
        Assert.Equal(phoneExpected,GetPhone);
        Assert.Equal(emergencyContactExpected,GetEmergencyContact);
    }
}