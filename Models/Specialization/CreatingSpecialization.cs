namespace sem5pi_24_25_g051.Models.Specialization
{
    public class CreatingSpecializationDto
    {
        public Specialization Specialization { get; set; }
        
        public CreatingSpecializationDto(Specialization specialization)
        {
            this.Specialization = specialization;
        }
    }
}