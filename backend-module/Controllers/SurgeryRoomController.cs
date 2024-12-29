using Microsoft.AspNetCore.Mvc;
using backend_module.Models.SurgeryRoom;

namespace backend_module.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgeryRoomController : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRoomController(SurgeryRoomService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<SurgeryRoomDto>>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> GetByIdAsync(Guid id)
        {
            var surgeryRoom = await _service.GetByIdAsync(new SurgeryRoomId(id));

            if (surgeryRoom == null)
            {
                return NotFound(new { message = "Surgery room not found" });
            }

            return surgeryRoom;
        }

        [HttpPost]
        public async Task<ActionResult<SurgeryRoomDto>> Create(CreatingSurgeryRoomDto surgeryRoomDto)
        {
            try
            {
                var existingRooms = await _service.GetAllAsync();
                foreach (var room in existingRooms)
                {
                    if (room.RoomNumber == surgeryRoomDto.RoomNumber)
                    {
                        return BadRequest(new { message = "This room number is already associated with a surgery room." });
                    }
                }

                var createdRoom = await _service.AddAsync(surgeryRoomDto);
                if (createdRoom == null)
                {
                    return BadRequest(new { message = "Unable to create surgery room." });
                }

                return CreatedAtAction(nameof(GetByIdAsync), new { id = createdRoom.RoomNumber }, createdRoom);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, SurgeryRoomDto surgeryRoomDto)
        {
            if (id.ToString() != surgeryRoomDto.RoomNumber)
            {
                return BadRequest(new { message = "Id in the URL does not match the Id in the body" });
            }

            try
            {
                var updatedRoom = await _service.UpdateAsync(surgeryRoomDto);
                if (updatedRoom == null)
                {
                    return NotFound(new { message = "Surgery room not found" });
                }

                return Ok(updatedRoom);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            var surgeryRoom = await _service.InactivateAsync(new SurgeryRoomId(id));

            if (surgeryRoom == null)
            {
                return NotFound(new { message = "Surgery room not found" });
            }

            return Ok(surgeryRoom);
        }

        [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDelete(Guid id)
        {
            try
            {
                var surgeryRoom = await _service.DeleteAsync(new SurgeryRoomId(id));
                if (surgeryRoom == null)
                {
                    return NotFound(new { message = "Surgery room not found" });
                }

                return Ok(surgeryRoom);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("active")]
        public async Task<ActionResult<List<SurgeryRoomDto>>> GetActiveAsync()
        {
            return await _service.GetAllAsync();
        }
    }
}
