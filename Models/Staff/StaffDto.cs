namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffDto
    {
        public int Id { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string FullName { get; set; }

        public required string LicenseNumber { get; set; }

        public required string Specialization { get; set; }

        public required string Email { get; set; }

        public required string Phone { get; set; }

        public required List<AvailabilitySlot> AvailabilitySlots { get; set; }
    }
}