using System;
using System.Collections.Generic;

namespace backend_module.Models.Specialization
{
    public class SpecializationMapper
    {
        public static SpecializationDto toDTO(CreatingSpecializationDto dto)
        {
            return new SpecializationDto(dto.specializationName);
        }

        public static SpecializationDto toDTO(Specialization spec)
        {
            return new SpecializationDto(spec.Id.AsGuid(), spec.SpecializationName);
        }
    }
}