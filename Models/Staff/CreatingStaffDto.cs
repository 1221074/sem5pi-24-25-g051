namespace sem5pi_24_25_g051.Models.Staff
{
    public class CreatingStaffDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string SpecializationName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        //public required List<AvailabilitySlot> AvailabilitySlots { get; set; }

        public CreatingStaffDto(string firstName, string lastName, string fullName, string specializationName, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationName = specializationName;
            this.Email = email;
            this.Phone = phone;
            //this.AvailabilitySlots = availabilitySlots;
        }
    }
}