using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Specialization;


namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private readonly SpecializationService _service;
        public SpecializationController(SpecializationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<SpecializationDto>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<SpecializationDto>> GetByIdAsync(Guid id)
        {
            var specialization = await _service.GetByIdAsync(new SpecializationId(id));

            if (specialization == null)
            {
                return NotFound();
            }
            return specialization;
        }

        [HttpPost]
        public async Task<ActionResult<SpecializationDto>> Create(CreatingSpecializationDto specializationDto)
        {
            List<SpecializationDto> list = await _service.GetAllAsync();
            foreach (SpecializationDto specialization in list)
            {
                if (specialization.SpecializationName.Equals(specializationDto.specializationName))
                {
                    return BadRequest(new { message = "Specialization already exists" });
                }
            }
            var dto = await _service.AddAsync(specializationDto);

            return dto;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, SpecializationDto specializationDto)
        {
            if (id != specializationDto.Id)
            {
                return BadRequest();
            }
            try
            {
                var dto = await _service.UpdateAsync(specializationDto);

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

        [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try 
            {
                var specialization = await _service.DeleteAsync(new SpecializationId(id));
                if (specialization == null)
                {
                    return NotFound();
                }
                return Ok(specialization);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

}