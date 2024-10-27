
namespace sem5pi_24_25_g051.Models.OperationRequest
{
    public class OperationRequestMapper
    {
        public static OperationRequestDto toDTO(CreatingOperationRequestDto dto)
        {
            return  new OperationRequestDto
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                OperationTypeId = dto.OperationTypeId,
                DeadlineDate = dto.DeadlineDate,
                PriorityState = dto.PriorityState
            };
        }

      public static OperationRequestDto toDTO(OperationRequest or)
    {
        return new OperationRequestDto
        {
            Id = or.Id.AsGuid(),
            DeadlineDate = or.DeadlineDate,
            PriorityState = or.PriorityState.ToString(), // Ensure enum to string conversion
            OperationTypeId = or.OperationTypeId,
            PatientId = or.PatientId,
            DoctorId = or.DoctorId
        };
    }
    }
}