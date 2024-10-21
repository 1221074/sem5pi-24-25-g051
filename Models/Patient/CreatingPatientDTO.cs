namespace sem5pi_24_25_g051.Models.Patient
{
    public class CreatingPatientDTO
    {

        public string Name { get; set; }

        public CreatingPatientDTO(string name)
        {
            this.Name = name;
        }
    }
}