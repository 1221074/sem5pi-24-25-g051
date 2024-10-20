using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.OperationType;


namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeMapper
    {
        public static OperationTypeDTO toDTO(CreatingOperationTypeDTO dto)
        {
            return new OperationTypeDTO(dto.Name, dto.Description);
        }

        public static OperationTypeDTO toDTO(OperationType OT)
        {
            return new OperationTypeDTO(OT.Id.AsString(), OT.Name, OT.Description);
        }
    }
}