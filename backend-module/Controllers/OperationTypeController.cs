using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_module.Models.OperationType;

using backend_module.Models.Shared;


namespace backend_module.Controllers
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
       // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDTO>> GetByIdAsync(Guid id)
        {

            var OT = await _service.GetByIdAsync(new OperationTypeId(id));

            if (OT == null)
            {
                return NotFound();
            }
          

            return OT;
        }

        [HttpGet("/api/operationtype/name/{name}")]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetByNameAsync(string name)
        {
            var operationtype = await _service.GetByNameAsync(name);

            if (operationtype == null)
            {
                return NotFound(new { message = "Operation Type not found" });
            }
            return operationtype;
        }

        [HttpGet("/api/operationtype/requiredstaff/{staff}")]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetByStaffAsync(string staff)
        {
            var operationtype = await _service.GetByStaffAsync(staff);

            if (operationtype == null)
            {
                return NotFound(new { message = "Operation Type not found" });
            }
            return operationtype;
        }

        [HttpGet("/api/operationtype/duration/{duration}")]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetByDurationAsync(string duration)
        {
            var operationtype = await _service.GetByDurationAsync(duration);

            if (operationtype == null)
            {
                return NotFound(new { message = "Operation Type not found" });
            }
            return operationtype;
        }

        [HttpPost] 
       // [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDTO>> Create(CreatingOperationTypeDTO OTDTO)
        {
            
                        
            
            var OT = await _service.AddAsync(OTDTO);
                        

            return OT;
    
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
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
     //   [Authorize(Roles = "Admin")]
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
       // [Authorize(Roles = "Admin")]
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

        [HttpGet("/api/operationtype/active")]
        public async Task<ActionResult<List<OperationTypeDTO>>> GetActiveAsync()
        {
            var operationtype = await _service.GetActiveAsync();

            if (operationtype == null)
            {
                return NotFound(new { message = "Operation Type not found" });
            }
            return operationtype;
        }

    }
}
