using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_module.Models.Patient
{
    public class PatientDTO
    {
        public Guid Id { get; set; }
        public string FirstName {get; set;}
        public string LastName {get;  set;}
        public string FullName {get;  set;}
        public string BirthDate {get;  set;}
        public string Sex {get;  set;}
        public string Email {get; set;}
        public string Phone {get; set;}
        public string EmergencyContact {get; set;}
        public List<string> AppointmentList {get; set;}
        public List<string> AllergyList {get;  set;}


         public PatientDTO(Guid id, string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact, List<string> appointmentList , List<string> allergyList)
        {
            Id = id;
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
        public PatientDTO(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact, List<string> appointmentList , List<string> allergyList)
        {
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
        public PatientDTO(string firstName, string lastName, string fullName, string birthDate, string sex, string email, string phone, string emergencyContact)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.BirthDate = birthDate;
            this.Sex = sex;
            this.Email = email;
            this.Phone = phone;
            this.EmergencyContact = emergencyContact;
            this.AppointmentList = [];
            this.AllergyList = [];
        }


        public PatientDTO()
        {
        }
        
    }
}