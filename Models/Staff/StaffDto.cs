namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffDto
    {
        public string Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string FullName { get; set; }

        public string Specialization { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        //public required List<AvailabilitySlot> AvailabilitySlots { get; set; }

        public Dictionary<DateTime, TimeSpan> Slots { get; set; }

        public StaffDto(string id, string firstName, string lastName, string fullName, string specialization, string email, string phone, /*List<AvailabilitySlot> availabilitySlots*/ Dictionary<DateTime, TimeSpan> slots)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Specialization = specialization;
            Email = email;
            Phone = phone;
            //AvailabilitySlots = availabilitySlots;
            Slots = slots;
        }

        public StaffDto(string firstName, string lastName, string fullName, string specialization, string email, string phone, /*List<AvailabilitySlot> availabilitySlots*/ Dictionary<DateTime, TimeSpan> slots)
        {
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Specialization = specialization;
            Email = email;
            Phone = phone;
            //AvailabilitySlots = availabilitySlots;
            Slots = slots;
        }

        public StaffDto()
        {
        }
    }
}