using System.Threading.Tasks;
using System.Collections.Generic;
using backend_module.Models.SurgeryRoom;
using backend_module.Models.Shared;
using backend_module.Models.Staff;

namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            List<SurgeryRoomDto> listDto = list.ConvertAll(s => new SurgeryRoomDto
            {
                RoomNumber = s.Id.Value.ToString(),
                Type = s.Type,
                Capacity = s.Capacity,
                AssignedEquipment = s.AssignedEquipment,
                CurrentStatus = s.Status,
                MaintenanceSlots = s.MaintenanceSlots
            });

            return listDto;
        }

        public async Task<SurgeryRoomDto> GetByIdAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);
            
            if(surgeryRoom == null)
                return null;

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }

        public async Task<SurgeryRoomDto> AddAsync(CreatingSurgeryRoomDto dto)
        {
           var existingSurgeryRooms = await this._repo.GetAllAsync();
            foreach (var existingSurgeryRoom in existingSurgeryRooms) {
                if (existingSurgeryRoom.Id.Value == dto.RoomNumber)
                    return null;
            }

            var surgeryRoom = new SurgeryRoom(dto.RoomNumber, dto.Type, dto.Capacity, dto.AssignedEquipment, dto.Status, dto.MaintenanceSlots); 

            await this._repo.AddAsync(surgeryRoom);

            await this._unitOfWork.CommitAsync();

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }

        public async Task<SurgeryRoomDto> UpdateAsync(SurgeryRoomDto dto)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(new SurgeryRoomId(dto.RoomNumber));    
            
            if (surgeryRoom == null) {
                return null;
            }

            surgeryRoom.Change( dto.Type, dto.Capacity, dto.AssignedEquipment, dto.CurrentStatus, dto.MaintenanceSlots);

            await this._unitOfWork.CommitAsync();

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }

        public async Task<SurgeryRoomDto> InactivateAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id); 

            if (surgeryRoom == null)
                return null;   

            surgeryRoom.MarkAsInactive();
            
            await this._unitOfWork.CommitAsync();

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }


        public async Task<SurgeryRoomDto> ActivateAsync(SurgeryRoomId id) {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            surgeryRoom.MarkAsActive();

            await this._unitOfWork.CommitAsync();

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }

        public async Task<SurgeryRoomDto> DeleteAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id); 

            if (surgeryRoom == null)
                return null;   

            if (surgeryRoom.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active surgery room.");
            
            this._repo.Remove(surgeryRoom);
            await this._unitOfWork.CommitAsync();

            return SurgeryRoomMapper.toDto(surgeryRoom);
        }
    }
}