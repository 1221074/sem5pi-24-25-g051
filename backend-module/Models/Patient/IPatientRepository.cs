using backend_module.Models.Shared;

namespace backend_module.Models.Patient
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
    }
}