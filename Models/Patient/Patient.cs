using System;
using Microsoft.OpenApi.Models;
using System.ComponentModel.DataAnnotations;
using sem5pi_24_25_g051.Models.Shared;
using System.Text.RegularExpressions;

namespace sem5pi_24_25_g051.Models.Patient
{
    public class Patient : Entity<PatientId>
    {
        public string FirstName {get; set;}

        public string LastName {get; set;}
        public string FullName {get; set;}
        public string BirthDate {get; set;}
        public string Sex {get; set;}
        public string Email {get; set;}
        public string Phone {get; set;}
        public string EmergencyContact {get; set;}
        public List<string> AppointmentList {get; set;}
        public List<string> AllergyList {get; set;}
        public bool Active{ get; set; }
        public static readonly Regex MailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        private Patient()
        {
            this.Active = true;
        }

        public Patient(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact, List<string> appointmentList , List<string> allergyList)
        {
            if (!EmailVerification(email)) {
                throw new ArgumentException("Email inválido", nameof(email));
            }
            this.Id = new PatientId(Guid.NewGuid());
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Sex = sex;
            this.Email = email;
            this.Phone = phone;
            this.EmergencyContact = emergencyContact;
            this.AppointmentList = appointmentList;
            this.AllergyList = allergyList;
            
        }

        public void Change(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact, List<string> appointmentList, List<string> allergyList)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive patient.");
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Sex = sex;
            this.Email = email;
            this.Phone = phone;
            this.EmergencyContact = emergencyContact;
            this.AppointmentList = appointmentList;
            this.AllergyList = allergyList;
        }
        public void MarkAsInative()
        {
            this.Active = false;
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
}
