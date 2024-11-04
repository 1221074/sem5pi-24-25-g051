using System.Threading.Tasks;
using System.Collections.Generic;
using backend_module.Models.Shared;

namespace backend_module.Models.Patient {
    public class PatientService {

        private readonly IPatientRepository _Prepo;
        private readonly IUnitOfWork _unitOfWork;

        public PatientService (IPatientRepository Prepo, IUnitOfWork unitOfWork) {
            _Prepo = Prepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<PatientDTO>> GetAllAsync() {
            var list = await this._Prepo.GetAllAsync();

            List<PatientDTO> listDto = new List<PatientDTO>();
            foreach (var s in list)
            {
                listDto.Add(PatientMapper.toDTO(s));
            }

            return listDto;
        }
        
        public async Task<PatientDTO> GetByIdAsync(PatientId id) {
            
            var P = await this._Prepo.GetByIdAsync(id);

            if (P == null) {
                return null;
            }

            return PatientMapper.toDTO(P);
        }

        public async Task<List<PatientDTO>> GetByFirstNameAsync(string name)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.FirstName == name)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByLastNameAsync(string name)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.LastName == name)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByFullNameAsync(string name)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.FullName == name)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByBirthDateAsync(string date)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.BirthDate == date)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetBySexAsync(string sex)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.Sex == sex)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<PatientDTO> GetByEmailAsync(string email)
        {
            var patients = await this._Prepo.GetAllAsync();

            

            foreach (var s in patients)
            {
                if (s.Email == email)
                {
                    return PatientMapper.toDTO(s);
                }
            }
            
            
                return null;
        }

        public async Task<List<PatientDTO>> GetByPhoneAsync(string phone)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.Phone == phone)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByEmergencyContactAsync(string emergencyContact)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                if (s.EmergencyContact == emergencyContact)
                {
                    dto.Add(PatientMapper.toDTO(s));
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByAllergyAsync(string allergy)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                foreach(var a in s.AllergyList)
                {
                    if (a == allergy)
                    {
                        dto.Add(PatientMapper.toDTO(s));
                        break;
                    }
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<List<PatientDTO>> GetByAppointmentAsync(string appointment)
        {
            var patients = await this._Prepo.GetAllAsync();

            List<PatientDTO> dto = new List<PatientDTO>();

            foreach (var s in patients)
            {
                foreach(var a in s.AppointmentList)
                {
                    if (a == appointment)
                    {
                        dto.Add(PatientMapper.toDTO(s));
                        break;
                    }
                }
            }
            
            if(patients == null)
                return null;

            return dto;
        }

        public async Task<PatientDTO> AddAsync(CreatingPatientDTO PDTO) {
            var P = new Patient(PDTO.FirstName, PDTO.LastName, PDTO.FullName, PDTO.BirthDate, PDTO.Sex, PDTO.Email, PDTO.Phone, PDTO.EmergencyContact, PDTO.AppointmentList, PDTO.AllergyList);

            await this._Prepo.AddAsync(P);
            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);
        }

        public async Task<PatientDTO> UpdateAsync(PatientDTO PDTO) {
            var P = await this._Prepo.GetByIdAsync(new PatientId(PDTO.Id));    

            if (P == null) {
                return null;
            }

            P.Change(PDTO.FirstName, PDTO.LastName, PDTO.FullName, PDTO.BirthDate, PDTO.Sex, PDTO.Email, PDTO.Phone, PDTO.EmergencyContact, PDTO.AppointmentList, PDTO.AllergyList);

            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);
        }

        public async Task<PatientDTO> InactivateAsync(PatientId id) {
            var P = await this._Prepo.GetByIdAsync(id);

            if (P == null) {
                return null;
            }

            P.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);
        }
        public async Task<PatientDTO> ActivateAsync(Guid id) {
            var P = await this._Prepo.GetByIdAsync(new PatientId(id));

            if (P == null) {
                return null;
            }

            P.MarkAsAnative();

            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);
        }

        public async Task<bool> CheckActive(Guid id) {
            var P = await this._Prepo.GetByIdAsync(new PatientId(id));

            if (P == null) {
                return false;
            }

            return P.Active;
        }

        public async Task<PatientDTO> DeleteAsync(PatientId id) {
            var P = await this._Prepo.GetByIdAsync(id);

            if (P == null) {
                return null;
            }

            if (P.Active) {
                throw new BusinessRuleValidationException("It is not possible to delete an active patient.");
            }

            this._Prepo.Remove(P);
            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);

        }
    }

}