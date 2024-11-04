using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend_module.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string _googleClientId = "YOUR_GOOGLE_CLIENT_ID";

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] TokenRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _googleClientId }
                });

                // Aqui você pode salvar o usuário no banco de dados ou criar uma sessão
                return Ok(payload);
            }
            catch (InvalidJwtException)
            {
                return BadRequest("Invalid token");
            }
        }
    }

    public class TokenRequest
    {
        public string Token { get; set; }
    }
}