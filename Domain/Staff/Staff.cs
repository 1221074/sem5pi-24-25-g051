using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.Net.Http.Headers;

namespace sem5pi_24_25_g051.Domain.Staff
{
    public class Staff
    {
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string FullName => $"{FirstName} {LastName}"; 
        public string LicenseNumber { get; set; } 
        public string Specialization { get; set; } 
        public string Email { get; set; } 
        public string Phone { get; set; } 
        public List<AvailabilitySlot> AvailabilitySlots { get; set; } 
        public bool IsAvailableForAppointment(DateTime appointmentTime, TimeSpan appointmentDuration) {}
    }

    public class AvailabilitySlot
    {
        public List<DateTime> Slot { get; set; } 
        public TimeSpan Duration { get; set; } 
    }
}