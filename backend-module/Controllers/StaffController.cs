using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_module.Models.Shared;
using backend_module.Models.Staff;
using backend_module.Models.Specialization;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.InteropServices;
using backend_module.Services;


namespace backend_module.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _service;
        private readonly SpecializationService _serviceSpecialization;
        public StaffController(StaffService service, SpecializationService serviceSpecialization)
        {
            _service = service;
            _serviceSpecialization = serviceSpecialization;
        }

        [HttpGet]
       // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<StaffDto>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }
        
        [HttpGet("{id}")]
      //  [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> GetByIdAsync(Guid id)
        {
            var staff = await _service.GetByIdAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/firstname/{name}")]
       // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<StaffDto>>> GetByFirstNameAsync(string name)
        {
            var staff = await _service.GetByFirstNameAsync(name);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/lastname/{name}")]
      //  [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<StaffDto>>> GetByLastNameAsync(string name)
        {
            var staff = await _service.GetByLastNameAsync(name);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/fullname/{name}")]
     //   [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<StaffDto>>> GetByFullNameAsync(string name)
        {
            var staff = await _service.GetByFullNameAsync(name);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/email/{email}")]
      //  [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> GetByEmailAsync(string email)
        {
            var staff = await _service.GetByEmailAsync(email);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/phone/{phone}")]
      //  [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> GetByPhoneAsync(string phone)
        {
            var staff = await _service.GetByPhoneAsync(phone);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpGet("/api/staff/specialization/{specialization}")]
     //   [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<StaffDto>>> GetBySpecializationAsync(Guid specialization)
        {
            var staff = await _service.GetBySpecializationAsync(specialization);

            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return staff;
        }

        [HttpPost]
      //  [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto staffDto)
        {
            List<StaffDto> list = await _service.GetAllAsync();
            foreach (StaffDto staff in list)
            {
                if (staff.Phone == staffDto.Phone)
                {
                    return BadRequest(new { message = "This phone number is already associated to a staff member." });
                }
                if (staff.Email == staffDto.Email)
                {
                    return BadRequest(new { message = "This email is already associated to a staff member." });
                }
            }
            Guid specId = Guid.Empty;

            List<SpecializationDto> listSpecialization = await _serviceSpecialization.GetAllAsync();
            foreach (SpecializationDto specialization in listSpecialization)
            {
                if (specialization.Id == staffDto.SpecializationId)
                {
                    specId = specialization.Id; 
                }
            }

            SpecializationDto specDto = await _serviceSpecialization.GetByIdAsync(specId);
            if (specDto == null)
                {
                    return BadRequest(new { message = "Specialization does not exist" });
                }

            

            

            var dto = await _service.AddAsync(new StaffDto(staffDto.FirstName, staffDto.LastName, staffDto.FullName, specId, staffDto.Email, staffDto.Phone));

            return dto;
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, StaffDto staffDto)
        {
            if(id != staffDto.Id){
                return BadRequest(new { message = "Id in the URL does not match the Id in the body" });
            }
            try
            {
                Guid specId = Guid.Empty;

                List<SpecializationDto> listSpecialization = await _serviceSpecialization.GetAllAsync();
                foreach (SpecializationDto specialization in listSpecialization)
                {
                    if (specialization.Id == staffDto.SpecializationId)
                    {
                        specId = specialization.Id; 
                    }
                }

                SpecializationDto specDto = await _serviceSpecialization.GetByIdAsync(specId);
                if (specDto == null)
                    {
                        return BadRequest(new { message = "Specialization does not exist" });
                    }

                

                var dto = await _service.UpdateAsync(staffDto);

                if (dto == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }
                //_service.SendEmailAsync(staffDto.Email, "Updated Personal Data", "Your Staff personal data has been changed. Please check the changes.");

                await GetGmailService.SendEmailUsingGmailApi(staffDto.Email, "Updated Personal Data", "Your Staff personal data has been changed. Please check the changes.");
                return Ok(dto);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
      //  [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            var staff = await _service.InactivateAsync(new StaffId(id));
            if (staff == null)
            {
                return NotFound(new { message = "Staff member not found" });
            }
            return Ok(staff);
        }

        [HttpDelete("{id}/hard")]
       // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try 
            {
                var staff = await _service.DeleteAsync(new StaffId(id));
                if (staff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }
                return Ok(staff);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("active")]

        public async Task<ActionResult<List<StaffDto>>> GetActiveAsync()
        {
            return await _service.GetAllActiveStaffAsync();
        }
    }
}