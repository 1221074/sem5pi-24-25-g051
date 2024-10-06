using System;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.Patient
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public string FullName => $"{FirstName} {LastName}";
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public required string Gender { get; set; }
        [Required]
        public required string MedicalRecordNumber { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        [Phone]
        public required string Phone { get; set; }

        [Required]
        public required string AllergiesOrMedicalConditions { get; set; }

        [Required]
        [Phone]
        public required string EmergencyContact { get; set; }

        [Required]
        public required List<Appointment> AppointmentHistory { get; set; }

       /*
        public void RequestDataAccess() { }
        public void RequestDataRemoval() { }     */
    }

    public class Appointment
    {
        public required DateTime AppointmentDate { get; set; }
        public required string Doctor { get; set; }
        public string? Description { get; set; }
    }
}
