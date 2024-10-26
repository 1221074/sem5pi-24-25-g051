using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;
using sem5pi_24_25_g051.Models.Patient;

using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Services;


namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _service;

        public PatientController(PatientService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PatientDTO>> GetByIdAsync(Guid id)
        {

            var P = await _service.GetByIdAsync(new PatientId(id));

            if (P == null)
            {
                return NotFound("Patient not found");
            }
          

            return P;
        }

        [HttpGet("/api/patient/firstname/{name}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByFirstNameAsync(string name)
        {
            var patients = await _service.GetByFirstNameAsync(name);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/lastname/{name}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByLastNameAsync(string name)
        {
            var patients = await _service.GetByLastNameAsync(name);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/fullname/{name}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByFullNameAsync(string name)
        {
            var patients = await _service.GetByFullNameAsync(name);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/birthdate/{date}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByBirthDateAsync(string date)
        {
            var patients = await _service.GetByBirthDateAsync(date);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/sex/{sex}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetBySexAsync(string sex)
        {
            var patients = await _service.GetBySexAsync(sex);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/email/{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PatientDTO>> GetByEmailAsync(string email)
        {
            var patients = await _service.GetByEmailAsync(email);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/phone/{phone}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByPhoneAsync(string phone)
        {
            var patients = await _service.GetByPhoneAsync(phone);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/emergencycontact/{emergencycontact}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByEmergencyContactAsync(string emergencycontact)
        {
            var patients = await _service.GetByEmergencyContactAsync(emergencycontact);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/allergy/{allergy}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByAllergyAsync(string allergy)
        {
            var patients = await _service.GetByAllergyAsync(allergy);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }

        [HttpGet("/api/patient/appointment/{appointment}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PatientDTO>>> GetByAppointmentAsync(string appointment)
        {
            var patients = await _service.GetByAppointmentAsync(appointment);

            if (patients == null)
            {
                return NotFound(new { message = "Patient not found" });
            }
            return patients;
        }


        [HttpPost] 
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PatientDTO>> Create(CreatingPatientDTO PDTO)
        {
            List<PatientDTO> list = await _service.GetAllAsync();
            foreach (PatientDTO Pdto in list)
            {
                if (Pdto.Phone == PDTO.Phone)
                {
                    return BadRequest(new { message = "This phone number is already associated to a patient." });
                }
                if (Pdto.Email == PDTO.Email)
                {
                    return BadRequest(new { message = "This email is already associated to a patient." });
                }
            }
                        
            
            var P = await _service.AddAsync(PDTO);
                        

            return P;
    
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, PatientDTO PDTO)
        {
            if (id != PDTO.Id)
            {
                return BadRequest();
            }

            try {
                var P = await _service.UpdateAsync(PDTO);

                if (P == null) {
                    return NotFound();
                }
                return Ok(P);

            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            var P = await _service.InactivateAsync(new PatientId(id));

            if (P == null)
            {
                return NotFound();
            }
            return Ok(P);
        }

        [HttpDelete("{id}/hard")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try {
                var P = await _service.DeleteAsync(new PatientId(id));

                if (P == null) {
                    return NotFound();
                }
                return Ok(P);

            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        //=======================================================================================================
        //=======================================  Patient Perms  ===============================================
        //=======================================================================================================
        
        
        [HttpPut("/profile/{id}")]
        public async Task<IActionResult> UpdateProfile(Guid id, PatientDTO PDTO)
        {

            if (id != PDTO.Id)
            {
                return BadRequest(new { message = "ID mismatch between URL and payload." });
            }
    
            try
            {
                var token = Guid.NewGuid().ToString();
                var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/profile/confirm?id={PDTO.Id}&firstName={Uri.EscapeDataString(PDTO.FirstName)}&lastName={Uri.EscapeDataString(PDTO.LastName)}&fullName={Uri.EscapeDataString(PDTO.FullName)}&birthDate={Uri.EscapeDataString(PDTO.BirthDate)}&sex={Uri.EscapeDataString(PDTO.Sex)}&email={Uri.EscapeDataString(PDTO.Email)}&phone={Uri.EscapeDataString(PDTO.Phone)}&emergencyContact={Uri.EscapeDataString(PDTO.EmergencyContact)}&appointmentList={Uri.EscapeDataString(string.Join(",", PDTO.AppointmentList))}&allergyList={Uri.EscapeDataString(string.Join(",", PDTO.AllergyList))}";
                var emailBody = $@" <html><body><p>Please confirm your changes on your profile by clicking the button below:</p><a href=""{confirmationLink}"" style=""display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-align: center; text-decoration: none; border-radius: 5px;"">Confirm Changes</a></body></html>";

                await GetGmailService.SendEmailUsingGmailApi(PDTO.Email, "Update Personal Data", emailBody);
                //await _service.UpdateAsync(PDTO);
                //await _service.InactivateAsync(new PatientId(PDTO.Id));

                return Ok(PDTO);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("/api/profile/confirm")]
        public async Task<IActionResult> ConfirmEmail(string id, [FromQuery] PatientDTO PDTO)
        {
            var patientId = new PatientId(Guid.Parse(id));
            var patient = await _service.GetByIdAsync(patientId);

            if (patient == null)
            {
                return NotFound();
            }

            try
            {
                // Update the patient profile with the new data
                patient.FirstName = PDTO.FirstName;
                patient.LastName = PDTO.LastName;
                patient.FullName = PDTO.FullName;
                patient.BirthDate = PDTO.BirthDate;
                patient.Sex = PDTO.Sex;
                patient.Email = PDTO.Email;
                patient.Phone = PDTO.Phone;
                patient.EmergencyContact = PDTO.EmergencyContact;
                patient.AppointmentList = PDTO.AppointmentList;
                patient.AllergyList = PDTO.AllergyList;

                await _service.UpdateAsync(patient);
                return Ok(patient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("/profile/{id}")]
        public async Task<IActionResult> SoftDeleteProfile(Guid id)
        {

            var token = Guid.NewGuid().ToString();
            var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/profile/hard?id={id}&token={Uri.EscapeDataString(token)}";
            var emailBody = $@" <html><body><p>Please confirm the deletion of your profile by clicking the button below:</p><a href=""{confirmationLink}"" style=""display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-align: center; text-decoration: none; border-radius: 5px;"">Confirm Deletion</a></body></html>";

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid email.");
            }
            await GetGmailService.SendEmailUsingGmailApi(email, "Profile Deletion", emailBody);

            var P = await _service.InactivateAsync(new PatientId(id));

            if (P == null)
            {
                return NotFound();
            }
            return Ok(P);
        }

        [HttpGet("/api/profile/hard")]
        public async Task<IActionResult> HardDeleteProfile(Guid id)
        {
            try
            {
                var P = await _service.GetByIdAsync(new PatientId(id));
                var email = P.Email;
                P = await _service.DeleteAsync(new PatientId(id));

                if (P == null)
                {
                    return NotFound();
                }
                await GetGmailService.SendEmailUsingGmailApi(email, "Profile Deletion", "Your profile has been successfully deleted.");
                return Ok(P);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail(Guid id, string token) {
            if (id.ToString().Equals("") || string.IsNullOrEmpty(token)) {
                return BadRequest("Id or token is missing.");
            }

            // Retrieve the user by NIF
            var user = await _service.GetByIdAsync(new PatientId(id));
            if (user == null) {
                return BadRequest("User not found.");
            }

            // Activate the user
            await _service.ActivateAsync(id);

            return Ok("Your account has been activated successfully.");
        }

    }
}
