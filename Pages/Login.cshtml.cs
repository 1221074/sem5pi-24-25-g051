using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using sem5pi_24_25_g051.Domain.User;
using sem5pi_24_25_g051.Infraestructure;

namespace sem5pi_24_25_g051.Pages
{
    public class LoginModel : PageModel
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager; 


        public LoginModel(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager; 
        }

        [BindProperty]
        public LoginViewModel Input { get; set; }

        public string ReturnUrl { get; set; }

        public void OnGet(string returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Content("~/");
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Content("~/");
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(
                    Input.Email, Input.Password, Input.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    // Get the logged-in user
                    var user = await _userManager.FindByEmailAsync(Input.Email);

                    if(user == null) {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                        return Page();
                    }

                    // Check if the users role and redirect to the corresponding page
                    if (await _userManager.IsInRoleAsync(user, "Doctor")){
                        return LocalRedirect(Url.Content("~/Doctor"));
                    }else if(await _userManager.IsInRoleAsync(user,"Admin")){
                        return LocalRedirect(Url.Content("~/Admin"));
                    }else if(await _userManager.IsInRoleAsync(user,"Nurse")){
                        return LocalRedirect(Url.Content("~/Nurse"));
                    }else if(await _userManager.IsInRoleAsync(user,"Technician")){
                        return LocalRedirect(Url.Content("~/Technician"));
                    }else if(await _userManager.IsInRoleAsync(user,"Patient")){
                        return LocalRedirect(Url.Content("~/Patient"));
                    }   
                }
            }

            return Page();
        }
    }
}
