using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Specialization;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.InteropServices;


namespace sem5pi_24_25_g051.Controllers
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
        public async Task<ActionResult<List<StaffDto>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetByIdAsync(Guid id)
        {
            var staff = await _service.GetByIdAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/firstname/{name}")]
        public async Task<ActionResult<List<StaffDto>>> GetByFirstNameAsync(string name)
        {
            var staff = await _service.GetByFirstNameAsync(name);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/lastname/{name}")]
        public async Task<ActionResult<List<StaffDto>>> GetByLastNameAsync(string name)
        {
            var staff = await _service.GetByLastNameAsync(name);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/fullname/{name}")]
        public async Task<ActionResult<List<StaffDto>>> GetByFullNameAsync(string name)
        {
            var staff = await _service.GetByFullNameAsync(name);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/email/{email}")]
        public async Task<ActionResult<StaffDto>> GetByEmailAsync(string email)
        {
            var staff = await _service.GetByEmailAsync(email);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/phone/{phone}")]
        public async Task<ActionResult<StaffDto>> GetByPhoneAsync(string phone)
        {
            var staff = await _service.GetByPhoneAsync(phone);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpGet("/specialization/{specialization}")]
        public async Task<ActionResult<List<StaffDto>>> GetBySpecializationAsync(Guid specialization)
        {
            var staff = await _service.GetBySpecializationAsync(specialization);

            if (staff == null)
            {
                return NotFound();
            }
            return staff;
        }

        [HttpPost]
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
        public async Task<IActionResult> Update(Guid id, StaffDto staffDto)
        {
            if (id != staffDto.Id)
            {
                return BadRequest();
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
                    return NotFound();
                }
                return Ok(dto);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            var staff = await _service.InactivateAsync(new StaffId(id));
            if (staff == null)
            {
                return NotFound();
            }
            return Ok(staff);
        }

        [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try 
            {
                var staff = await _service.DeleteAsync(new StaffId(id));
                if (staff == null)
                {
                    return NotFound();
                }
                return Ok(staff);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

}