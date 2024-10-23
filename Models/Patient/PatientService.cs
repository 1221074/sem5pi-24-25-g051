using System.Threading.Tasks;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Patient {
    public class PatientService {

        private readonly IPatientRepository _Prepo;
        private readonly IUnitOfWork _unitOfWork;

        public PatientService (IPatientRepository Prepo, IUnitOfWork unitOfWork) {
            _Prepo = Prepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<PatientDTO>> GetAllAsync() {
            var list = await this._Prepo.GetAllAsync();

            List<PatientDTO> listDTO = list.ConvertAll(P => new PatientDTO {
                Id = P.Id.AsGuid(),
                FirstName = P.FirstName,
                LastName = P.LastName,
                FullName = P.LastName,
                BirthDate = P.BirthDate,
                Sex = P.Sex,
                AllergyList = P.AllergyList
            });

            return listDTO;
        }
        
        public async Task<PatientDTO> GetByIdAsync(PatientId id) {
            
            var P = await this._Prepo.GetByIdAsync(id);

            if (P == null) {
                return null;
            }

            return PatientMapper.toDTO(P);
        }

        public async Task<PatientDTO> AddAsync(CreatingPatientDTO PDTO) {
            var P = new Patient(PDTO.FirstName, PDTO.LastName, PDTO.FullName, PDTO.BirthDate, PDTO.Sex, PDTO.AllergyList);

            

            await this._Prepo.AddAsync(P);
            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);


        }

        public async Task<PatientDTO> UpdateAsync(PatientDTO PDTO) {
            var P = await this._Prepo.GetByIdAsync(new PatientId(PDTO.Id));    

            if (P == null) {
                return null;
            }

            P.Change(PDTO.FirstName, PDTO.LastName, PDTO.FullName, PDTO.BirthDate, PDTO.Sex, PDTO.AllergyList);

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

        public async Task<PatientDTO> DeleteAsync(PatientId id) {
            var P = await this._Prepo.GetByIdAsync(id);

            if (P == null) {
                return null;
            }

            if (P.Active) {
                throw new BusinessRuleValidationException("It is nP possible to delete an active patient.");
            }

            this._Prepo.Remove(P);
            await this._unitOfWork.CommitAsync();

            return PatientMapper.toDTO(P);

        }
    }

}