using sem5pi_24_25_g051.Models.Patient;
using sem5pi_24_25_g051.Infraestructure.Shared;
using sem5pi_24_25_g051.Infraestructure;

namespace sem5pi_24_25_g051.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        public PatientRepository(backofficeDbContext context):base(context.Patients)
        {

        }
    }
}