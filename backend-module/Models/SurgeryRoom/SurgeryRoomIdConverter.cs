using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoomIdConverter : ValueConverter<SurgeryRoomId, Guid>
    {
        public SurgeryRoomIdConverter() : base(
            id => id.AsGuid(),
            guid => new SurgeryRoomId(guid))
        {
        }
    }
}