using System;
using System.Collections.Generic;
using backend_module.Models.OperationType;


namespace backend_module.Models.OperationType
{
    public class OperationTypeMapper
    {
        public static OperationTypeDTO toDTO(CreatingOperationTypeDTO dto)
        {
            return new OperationTypeDTO(dto.Name, dto.RequiredStaff, dto.Duration);
        }

        public static OperationTypeDTO toDTO(OperationType OT)
        {
            return new OperationTypeDTO(OT.Id.AsGuid(), OT.Name, OT.RequiredStaff, OT.Duration);
        }
    }
}