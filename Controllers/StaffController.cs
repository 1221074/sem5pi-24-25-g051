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

namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _service;
        public StaffController(StaffService service)
        {
            _service = service;
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

        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto staffDto)
        {
            var dto = StaffMapper.toDTO(staffDto);
            var staff = await _service.AddAsync(staffDto);
            return staff;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, StaffDto staffDto)
        {
            if (id.ToString() != staffDto.Id)
            {
                return BadRequest();
            }
            try
            {
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