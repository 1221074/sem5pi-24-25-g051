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
    public class ComplexityAnalysisController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ComplexityAnalysisController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        // GET: api/ComplexityAnalysis
        [HttpGet]
        public async Task<IActionResult> GetComplexityAnalysis([FromQuery] string room, [FromQuery] string date)
        {
            if (string.IsNullOrEmpty(room) || string.IsNullOrEmpty(date))
            {
                return BadRequest("Missing required query parameters: room, date.");
            }

            try
            {
                // Build the Prolog server URL
                string prologUrl = $"http://localhost:5000/complexity_analysis?room={room}&date={date}";

                // Send GET request to Prolog server
                HttpResponseMessage response = await _httpClient.GetAsync(prologUrl);

                if (response.IsSuccessStatusCode)
                {
                    // Read response content
                    string content = await response.Content.ReadAsStringAsync();

                    // Deserialize JSON response
                    var analysisResult = JsonConvert.DeserializeObject<dynamic>(content);

                    return Ok(analysisResult);
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
