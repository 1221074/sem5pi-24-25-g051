using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Infrastructure;
using sem5pi_24_25_g051.Models.OperationType;

namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {
        private readonly backofficeDbContext _context;

        public OperationTypeController(backofficeDbContext context)
        {
            _context = context;
        }

        // GET: api/OperationType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationType>>> GetOperationType()
        {
            return await _context.OperationType.ToListAsync();
        }

        // GET: api/OperationType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationType>> GetOperationType(int id)
        {
            var operationType = await _context.OperationType.FindAsync(id);

            if (operationType == null)
            {
                return NotFound();
            }

            return operationType;
        }

        // PUT: api/OperationType/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOperationType(int id, OperationType operationType)
        {
            if (id != operationType.Id)
            {
                return BadRequest();
            }

            _context.Entry(operationType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OperationTypeExists(id))
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

        // POST: api/OperationType
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OperationType>> PostOperationType(OperationType operationType)
        {
            _context.OperationType.Add(operationType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOperationType", new { id = operationType.Id }, operationType);
        }

        // DELETE: api/OperationType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOperationType(int id)
        {
            var operationType = await _context.OperationType.FindAsync(id);
            if (operationType == null)
            {
                return NotFound();
            }

            _context.OperationType.Remove(operationType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OperationTypeExists(int id)
        {
            return _context.OperationType.Any(e => e.Id == id);
        }
    }
}
