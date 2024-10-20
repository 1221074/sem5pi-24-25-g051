namespace sem5pi_24_25_g051.Models.OperationType
{
    public class CreatingOperationTypeDTO
    {

        public string Name { get; set; }
        public List<string> RequiredStaff { get;  private set; }

        public string Duration { get;  private set; }

        public CreatingOperationTypeDTO(string name, List<string> requiredStaff, string duration)
        {
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.Duration = duration;
        }
    }
}