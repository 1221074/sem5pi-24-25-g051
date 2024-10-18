namespace sem5pi_24_25_g051.Models.OperationType
{
    public class CreatingOperationTypeDTO
    {

        public string Name { get; set; }
        public string Description { get; set; }

        public CreatingOperationTypeDTO(string name, string description)
        {
            this.Name = name;
            this.Description = description;
        }
    }
}