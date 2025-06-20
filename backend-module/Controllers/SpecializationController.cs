using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_module.Models.Shared;
using backend_module.Models.Specialization;


namespace backend_module.Controllers
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
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<SpecializationDto>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }
        
        [HttpGet("{id}")]
       // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SpecializationDto>> GetByIdAsync(Guid id)
        {
            var specialization = await _service.GetByIdAsync(id);

            if (specialization == null)
            {
                return NotFound(new { message = "Specialization not found" });
            }
            return specialization;
        }

        [HttpPost]
     //   [Authorize(Roles = "Admin")]
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
       // [Authorize(Roles = "Admin")]
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
                    return NotFound(new { message = "Specialization not found" });
                }
                return Ok(dto);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}/hard")]
       // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try 
            {
                var specialization = await _service.DeleteAsync(new SpecializationId(id));
                if (specialization == null)
                {
                    return NotFound(new { message = "Specialization not found" });
                }
                return Ok(specialization);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

}