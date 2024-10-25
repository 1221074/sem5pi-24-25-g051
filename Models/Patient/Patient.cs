/*using System;
using Microsoft.OpenApi.Models;
using System.ComponentModel.DataAnnotations;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Patient
{
    public class Patient : Entity<PatientId>
    {
        public string FirstName {get; private set;}

        public string LastName {get; private set;}
        public string FullName {get; private set;}
        public string BirthDate {get; private set;}
        public string Sex {get; private set;}
        public List<string> AllergyList {get; private set;}
        public bool Active{ get;  private set; }

        private Patient()
        {
            this.Active = true;
        }

        public Patient(string FirstName, string LastName, string FullName, string BirthDate, string Sex, List<string> AllergyList)
        {
            this.Id = new PatientId(Guid.NewGuid());
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.FullName = FullName;
            this.BirthDate = BirthDate;
            this.Sex = Sex;
            this.AllergyList = AllergyList;
        }

        public void Change(string FirstName, string LastName, string FullName, string BirthDate, string Sex, List<string> AllergyList)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive patient.");
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.FullName = FullName;
            this.BirthDate = BirthDate;
            this.Sex = Sex;
            this.AllergyList = AllergyList;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}
*/