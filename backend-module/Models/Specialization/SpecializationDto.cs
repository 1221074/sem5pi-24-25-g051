namespace backend_module.Models.Specialization
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }
        public string SpecializationName { get; set; }

        public SpecializationDto(Guid id, string specializationName)
        {
            Id = id;
            SpecializationName = specializationName;
        }

        public SpecializationDto(String specializationName)
        {
            SpecializationName = specializationName;
        }

        public SpecializationDto()
        {
        }
    }
}