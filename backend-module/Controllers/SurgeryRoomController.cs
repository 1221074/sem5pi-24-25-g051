using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend_module.Infraestructure;
using backend_module.Models.SurgeryRoom;

namespace backend_module.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgeryRoomController : ControllerBase
    {
        private readonly backofficeDbContext _context;

        public SurgeryRoomController(backofficeDbContext context)
        {
            _context = context;
        }

        // GET: api/SurgeryRoom
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SurgeryRoom>>> GetSurgeryRoom()
        {
            return await _context.SurgeryRoom.ToListAsync();
        }

        // GET: api/SurgeryRoom/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SurgeryRoom>> GetSurgeryRoom(int id)
        {
            var surgeryRoom = await _context.SurgeryRoom.FindAsync(id);

            if (surgeryRoom == null)
            {
                return NotFound();
            }

            return surgeryRoom;
        }

        // PUT: api/SurgeryRoom/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSurgeryRoom(int id, SurgeryRoom surgeryRoom)
        {
            if (id.ToString() != surgeryRoom.Id.Value)
            {
                return BadRequest();
            }

            _context.Entry(surgeryRoom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SurgeryRoomExists(id))
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

        // POST: api/SurgeryRoom
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SurgeryRoom>> PostSurgeryRoom(SurgeryRoom surgeryRoom)
        {
            _context.SurgeryRoom.Add(surgeryRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSurgeryRoom", new { id = surgeryRoom.Id }, surgeryRoom);
        }

        // DELETE: api/SurgeryRoom/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSurgeryRoom(int id)
        {
            var surgeryRoom = await _context.SurgeryRoom.FindAsync(id);
            if (surgeryRoom == null)
            {
                return NotFound();
            }

            _context.SurgeryRoom.Remove(surgeryRoom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SurgeryRoomExists(int id)
        {
            return _context.SurgeryRoom.Any(e => e.Id.Value == id.ToString());
        }
    }
}
