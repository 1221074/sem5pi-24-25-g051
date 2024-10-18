using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Infraestructure;
using sem5pi_24_25_g051.Models.OperationRequest;

namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly backofficeDbContext _context;

        public OperationRequestController(backofficeDbContext context)
        {
            _context = context;
        }

        // GET: api/OperationRequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetOperationRequest()
        {
            return await _context.OperationRequest.ToListAsync();
        }

        // GET: api/OperationRequest/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequest>> GetOperationRequest(int id)
        {
            var operationRequest = await _context.OperationRequest.FindAsync(id);

            if (operationRequest == null)
            {
                return NotFound();
            }

            return operationRequest;
        }

        // PUT: api/OperationRequest/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOperationRequest(int id, OperationRequest operationRequest)
        {
            if (id != operationRequest.Id)
            {
                return BadRequest();
            }

            _context.Entry(operationRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OperationRequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OperationRequest
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OperationRequest>> PostOperationRequest(OperationRequest operationRequest)
        {
            _context.OperationRequest.Add(operationRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOperationRequest", new { id = operationRequest.Id }, operationRequest);
        }

        // DELETE: api/OperationRequest/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOperationRequest(int id)
        {
            var operationRequest = await _context.OperationRequest.FindAsync(id);
            if (operationRequest == null)
            {
                return NotFound();
            }

            _context.OperationRequest.Remove(operationRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OperationRequestExists(int id)
        {
            return _context.OperationRequest.Any(e => e.Id == id);
        }
    }
}
