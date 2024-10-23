namespace sem5pi_24_25_g051.Models.Specialization
{
    public class CreatingSpecializationDto
    {
        public string specializationName { get; set; }
        
        public CreatingSpecializationDto(string specializationName)
        {
            this.specializationName = specializationName;
        }
    }
}