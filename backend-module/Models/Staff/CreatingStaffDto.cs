namespace backend_module.Models.Staff
{
    public class CreatingStaffDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public Guid SpecializationId { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        //public required List<AvailabilitySlot> AvailabilitySlots { get; set; }

        public CreatingStaffDto(string firstName, string lastName, string fullName, Guid specializationID, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationId = specializationID;
            this.Email = email;
            this.Phone = phone;
            //this.AvailabilitySlots = availabilitySlots;
        }
    }
}