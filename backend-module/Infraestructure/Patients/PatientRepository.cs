using backend_module.Models.Patient;
using backend_module.Infraestructure.Shared;
using backend_module.Infraestructure;

namespace backend_module.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        public PatientRepository(backofficeDbContext context):base(context.Patients)
        {

        }
    }
}