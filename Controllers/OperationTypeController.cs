using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models.OperationType;

using sem5pi_24_25_g051.Models.Shared;


namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {
        private readonly OperationTypeService _service;

        public OperationTypeController(OperationTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OperationTypeDTO>> GetByIdAsync(Guid id)
        {

            var OT = await _service.GetByIdAsync(new OperationTypeId(id));

            if (OT == null)
            {
                return NotFound();
            }
          

            return OT;
        }

        [HttpPost] 
        public async Task<ActionResult<OperationTypeDTO>> Create(CreatingOperationTypeDTO OTDTO)
        {
            List<OperationTypeDTO> list = await _service.GetAllAsync();
            foreach (OperationTypeDTO OpT in list)
            {
                if (OpT.Name == OTDTO.Name)
                {
                    return BadRequest(new { message = "Operation Type already exists" });
                }
            }
                        
            
            var OT = await _service.AddAsync(OTDTO);
                        

            return OT;
    
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, OperationTypeDTO OTDTO)
        {
            if (id != OTDTO.Id)
            {
                return BadRequest();
            }

            try {
                var OT = await _service.UpdateAsync(OTDTO);

                if (OT == null) {
                    return NotFound();
                }
                return Ok(OT);

            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            var OT = await _service.InactivateAsync(new OperationTypeId(id));

            if (OT == null)
            {
                return NotFound();
            }
            return Ok(OT);
        }

        [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try {
                var OT = await _service.DeleteAsync(new OperationTypeId(id));

                if (OT == null) {
                    return NotFound();
                }
                return Ok(OT);

            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
