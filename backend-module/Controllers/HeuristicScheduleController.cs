using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace backend_module.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeuristicScheduleController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public HeuristicScheduleController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // GET: api/HeuristicSchedule
        [HttpGet]
        public async Task<IActionResult> GetHeuristicSchedule([FromQuery] string room, [FromQuery] string date, [FromQuery] string surgeries, [FromQuery] string heuristic = null)
        {
            if (string.IsNullOrEmpty(room) || string.IsNullOrEmpty(date) || string.IsNullOrEmpty(surgeries))
            {
                return BadRequest("Missing required query parameters: room, date, surgeries.");
            }

            try
            {
                // Build the Prolog server URL
                string prologUrl = $"http://localhost:5000/heuristic_schedule?room={room}&date={date}&surgeries={surgeries}";

                if (!string.IsNullOrEmpty(heuristic))
                {
                    prologUrl += $"&heuristic={heuristic}";
                }

                // Send GET request to Prolog server
                HttpResponseMessage response = await _httpClient.GetAsync(prologUrl);

                if (response.IsSuccessStatusCode)
                {
                    // Read response content
                    string content = await response.Content.ReadAsStringAsync();

                    // Deserialize JSON response
                    var schedulingResult = JsonConvert.DeserializeObject<dynamic>(content);

                    return Ok(schedulingResult);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "Error from Prolog server.");
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
