using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using backend_module.Models.Shared;
using backend_module.Models.Specialization;

namespace backend_module.Models.Staff
{
    public class Staff : Entity<StaffId>
    {
        [Required]
        public string FirstName { get; set; } 
        [Required]
        public string LastName { get; set; } 
        public string FullName { get; set; } 
        [Required]
        public Guid SpecializationId { get; set; } 
        [Required]
        public string Email { get; set; } 
        [Required]
        public string Phone { get; set; } 
        [Required]
        public bool Active { get; set; } = true;
        /*[Required]
        [NotMapped]
        public List<AvailabilitySlot> AvailabilitySlots { get; set; } */

        public static readonly Regex MailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        private Staff()
        {
            this.Active = true;
        }

        public void MarkAsInactive()
        {
            this.Active = false;
        }

        public Staff(string firstName, string lastName, string fullName, Guid specialization, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            if (!EmailVerification(email)) {
                throw new ArgumentException("Email inválido", nameof(email));
            }
            this.Id = new StaffId(Guid.NewGuid());
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationId = specialization;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
        }

        public void EditStaffProfile(string firstName, string lastName, string fullName, Guid specializationId, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change data of an inactive Staff member.");

            if (!EmailVerification(email)) {
                throw new ArgumentException("Invalid email.", nameof(email));
            }
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationId = specializationId;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
        }

        public static bool EmailVerification(string mail) {
             if (string.IsNullOrEmpty(mail)){
            return false;
            }

            // Regex to check if email is valid
            if (!MailRegex.IsMatch(mail))
            {
                return false;
            }
            return true;
        }

    }
    /*
    public class AvailabilitySlot
    {
        [Required]
        public required List<DateTime> Slot { get; set; } 
        [Required]
        public required TimeSpan Duration { get; set; } 
    }*/
}