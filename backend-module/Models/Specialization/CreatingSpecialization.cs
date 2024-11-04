namespace backend_module.Models.Specialization
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