using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.Patient
{
    public class PatientDTO
    {
        public Guid Id { get; set; }

        public string FirstName {get; set;}

        public string LastName {get;  set;}
        public string FullName {get;  set;}
        public string BirthDate {get;  set;}
        public string Sex {get;  set;}
        public List<string> AllergyList {get;  set;}

         public PatientDTO(string FirstName, string LastName, string FullName, string BirthDate, string Sex, List<string> AllergyList)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.FullName = FullName;
            this.BirthDate = BirthDate;
            this.Sex = Sex;
            this.AllergyList = AllergyList;
        }
        public PatientDTO(Guid id, string FirstName, string LastName, string FullName, string BirthDate, string Sex, List<string> AllergyList)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.FullName = FullName;
            this.BirthDate = BirthDate;
            this.Sex = Sex;
            this.AllergyList = AllergyList;
            Id = id;
        }

        public PatientDTO()
        {
        }
        
    }
}