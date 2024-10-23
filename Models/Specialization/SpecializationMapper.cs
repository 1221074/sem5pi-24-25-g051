using System;
using System.Collections.Generic;

namespace sem5pi_24_25_g051.Models.Specialization
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