using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.Patient
{
    public class Patient
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string FullName => $"{FirstName} {LastName}";

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; }

        public string MedicalRecordNumber { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string AllergiesOrMedicalConditions { get; set; }

        public string EmergencyContact { get; set; }

        public List<Appointment> AppointmentHistory { get; set; }

       /*
        public void RequestDataAccess() { }
        public void RequestDataRemoval() { }     */
    }

    public class Appointment
    {
        public DateTime AppointmentDate { get; set; }
        public string Doctor { get; set; }
        public string Description { get; set; }
    }
}
