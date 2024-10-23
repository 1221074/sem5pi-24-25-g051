using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _service;

        public OperationRequestController(OperationRequestService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<OperationRequestDto>>> GetAllAsync()
        {
            var requests = await _service.GetAllAsync();
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequestDto>> GetByIdAsync(Guid id)
        {
            var request = await _service.GetByIdAsync(new OperationRequestId(id));

            if (request == null)
            {
                return NotFound();
            }

            return Ok(request);
        }

        [HttpPost]
        public async Task<ActionResult<OperationRequestDto>> CreateAsync(CreatingOperationRequestDto requestDto)
        {
            List<OperationRequestDto> list = await _service.GetAllAsync();

            foreach (OperationRequestDto OpT in list)
            {
                if (OpT.DeadlineDate == requestDto.DeadlineDate)
                {
                    return BadRequest(new { message = "Operation Type already exists" });
                }
            }

            try
            {
                var createdRequest = await _service.AddAsync(requestDto);
                return createdRequest;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to create operation request: {ex.Message}");
            }    
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(Guid id, OperationRequestDto requestDto)
        {
            if (id != requestDto.Id)
            {
                return BadRequest(new { message = "ID mismatch between URL and payload." });
            }

            try
            {
                var updatedRequest = await _service.UpdateAsync(requestDto);
                
                if (updatedRequest == null)
                {
                    return NotFound(new { message = "Operation request not found." });
                }

                return Ok(updatedRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            try
            {
                var request = await _service.DeleteAsync(new OperationRequestId(id));
                if (request == null)
                {
                    return NotFound(new { message = "Operation request not found." });
                }

                return Ok(request);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
