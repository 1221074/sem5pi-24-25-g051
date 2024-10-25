using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models.Patient;

using sem5pi_24_25_g051.Models.Shared;


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
        public async Task<ActionResult<List<PatientDTO>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO>> GetByIdAsync(Guid id)
        {

            var P = await _service.GetByIdAsync(new PatientId(id));

            if (P == null)
            {
                return NotFound();
            }
          

            return P;
        }

        [HttpPost] 
        public async Task<ActionResult<PatientDTO>> Create(CreatingPatientDTO PDTO)
        {
            List<PatientDTO> list = await _service.GetAllAsync();
            foreach (PatientDTO Pdto in list)
            {
                if (Pdto.FullName == PDTO.FullName)
                {
                    return BadRequest(new { message = "Patient already exists" });
                }
            }
                        
            
            var P = await _service.AddAsync(PDTO);
                        

            return P;
    
        }

        [HttpPut("{id}")]
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

    }
}
