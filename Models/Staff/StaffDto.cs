namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string FullName { get; set; }

        public Guid SpecializationId { get; set; }
        public string Email { get; set; }

        public string Phone { get; set; }

        //public required List<AvailabilitySlot> AvailabilitySlots { get; set; }


        public StaffDto(Guid id, string firstName, string lastName, string fullName, Guid specializationId, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            SpecializationId = specializationId;
            Email = email;
            Phone = phone;
            //AvailabilitySlots = availabilitySlots;
        }

        public StaffDto(string firstName, string lastName, string fullName, Guid specializationId, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            SpecializationId = specializationId;
            Email = email;
            Phone = phone;
            //AvailabilitySlots = availabilitySlots;
        }

        public StaffDto()
        {
        }
    }
}