namespace sem5pi_24_25_g051.Models.OperationType
{
    public class CreatingOperationTypeDTO
    {

        public string Name { get; set; }
        public List<Guid> RequiredStaff { get;  set; }

        public string Duration { get;  set; }

        public CreatingOperationTypeDTO(string name, List<Guid> requiredStaff, string duration)
        {
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.Duration = duration;
        }
    }
}