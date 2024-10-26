using Microsoft.AspNetCore.Mvc;
using sem5pi_24_25_g051.Models.User;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;



namespace sem5pi_24_25_g051.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAllAsync()
        {
            var users = await _service.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetByIdAsync(string id)
        {
            var user = await _service.GetByIdAsync(new UserNif(id));

            if (user == null)
            {
                return BadRequest(new { message = "User with this nif doesn't exist." });
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateAsync(CreatingUserDTO userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Check if a user with the same email already exists
            var existingUsers = await _service.GetAllAsync();
            foreach (var existingUser in existingUsers)
            {
                if (existingUser.Email.Equals(userDto.Email))
                {
                    return BadRequest(new { message = "User with this email already exists." });
                }

                if (existingUser.Nif.Equals(userDto.Nif))
                {
                    return BadRequest(new { message = "User with this NIF already exists." });
                }
            }
               try
                {
                    // Create the user with Active set to false
                    var createdUser = await _service.AddAsync(userDto);
                    var token = Guid.NewGuid().ToString();

                    //await _service.SaveActivationTokenAsync(createdUser.Nif, token);

                    var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/user/confirm?nif={userDto.Nif}&token={Uri.EscapeDataString(token)}";

                    var emailBody = $@" <html><body><p>Please activate your account by clicking the button below:</p><a href=""{confirmationLink}"" style=""display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-align: center; text-decoration: none; border-radius: 5px;"">Activate Account</a></body></html>";

                    // Send the email using Gmail API
                    await GetGmailService.SendEmailUsingGmailApi(userDto.Email, "Activate your account", emailBody);
                    
                    return createdUser;
                } catch (Exception ex) {
                    return StatusCode(500, $"Failed to send email: {ex.Message}");
                } 
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(string id, UserDto userDto)
        {
            if (id != userDto.Nif)
            {
                return BadRequest(new { message = "ID mismatch between URL and payload." });
            }

            try
            {
                var updatedUser = await _service.UpdateAsync(userDto);
                if (updatedUser == null)
                {
                   return BadRequest(new { message = "User with this nif doesn't exist." });
                }

                return Ok(updatedUser);
            } catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

       [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteAsync(string id)
        {
            try
            {
                var user = await _service.InactivateAsync(new UserNif(id));
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

       [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDeleteAsync(string id)
        {
            try
            {

                var user = await _service.DeleteAsync(new UserNif(id));
                if (user == null)
                {
                    return NotFound(new { message = "User not found."});
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail(string nif, string token) {
            if (string.IsNullOrEmpty(nif) || string.IsNullOrEmpty(token)) {
                return BadRequest("NIF or token is missing.");
            }

            // Retrieve the user by NIF
            var user = await _service.GetByIdAsync(new UserNif(nif));
            if (user == null) {
                return BadRequest("User not found.");
            }

            // Activate the user
            await _service.ActivateAsync(new UserNif(nif));

            return Ok("Your account has been activated successfully.");
        }           
    }
}
