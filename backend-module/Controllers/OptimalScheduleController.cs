/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend_module.Models.OperationRequest;
using backend_module.Models.SurgeryRoom; // For JSON serialization/deserialization

namespace backend_module.Controllers
{
[Route("api/[controller]")]
[ApiController]
public class OptimalScheduleController : ControllerBase
{
    private readonly PlanningService _planningService;

    public OptimalScheduleController(PlanningService planningService)
    {
        _planningService = planningService;
    }

    [HttpGet]
    public async Task<IActionResult> GetOptimalSchedule([FromQuery] string room,[FromQuery] string date,[FromQuery] string surgeries,[FromBody] List<SurgeryRoom> surgeryRooms,[FromBody] List<OperationRequest> operationRequests)
    {
        try
        {
            var result = await _planningService.GetOptimalSchedule(room, date, surgeries);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

}
*/
