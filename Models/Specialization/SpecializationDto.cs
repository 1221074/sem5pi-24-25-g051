namespace sem5pi_24_25_g051.Models.Specialization
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }
        public Specialization Specialization { get; set; }

        public SpecializationDto(Guid id, Specialization specialization)
        {
            Id = id;
            Specialization = specialization;
        }

        public SpecializationDto(Specialization specialization)
        {
            Specialization = specialization;
        }

        public SpecializationDto()
        {
        }
    }
}