using Microsoft.AspNetCore.Mvc;
using backend_module.Models.User;
using backend_module.Models.Shared;
using backend_module.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Google.Apis.Auth;



namespace backend_module.Controllers
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

        //Http get with email only
        [HttpGet("email/{email}")]
        public async Task<ActionResult<UserDto>> GetByEmailAsync(string email)
        {
            var user = await _service.GetByEmailAsync(email);
            if (user == null)
            {
                return BadRequest(new { message = "User with this email doesn't exist." });
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
                 
                    var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/user/confirm?nif={userDto.Nif}";

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
        public async Task<IActionResult> ConfirmEmail(string nif) {
            if (string.IsNullOrEmpty(nif)) {
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

 [HttpGet("role")]
public async Task<IActionResult> GetUserRoleAsync([FromQuery] string token)
{
    if (string.IsNullOrEmpty(token))
    {
        if (Request.Headers.ContainsKey("Authorization"))
        {
            // Check if token is in the Authorization header
            var authHeader = Request.Headers["Authorization"].ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
            }
        }
    }

    if (string.IsNullOrEmpty(token))
    {
        return BadRequest("Token is missing.");
    }

    // Verify the Google ID token
    var payload = await _service.VerifyGoogleTokenAsync(token);
    if (payload == null)
    {
        return Unauthorized("Invalid Google ID token.");
    }

    // Retrieve the user's role based on email
    var role = await _service.GetUserRoleByEmailAsync(payload.Email);
    if (string.IsNullOrEmpty(role.ToString()))
    {
        return NotFound("User not found.");
    }

    return Ok(new { role });
}


    }
}
