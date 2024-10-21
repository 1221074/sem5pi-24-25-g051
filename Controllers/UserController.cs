using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using sem5pi_24_25_g051.Models.User;
using sem5pi_24_25_g051.Models.Shared;

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
                return NotFound();
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
                var createdUser = await _service.AddAsync(userDto);
                return createdUser;
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
                    return NotFound(new { message = "User not found." });
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
    }
}
