using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using sem5pi_24_25_g051.Domain.User;
using Microsoft.AspNetCore.Identity.UI.Services;
using sem5pi_24_25_g051.Pages;
using sem5pi_24_25_g051.Infraestructure;
using System.ComponentModel.DataAnnotations;





namespace sem5pi_24_25_g051.Controllers;

[Authorize(Roles = "Admin")]
public class US511Controller : Controller
{
    private readonly UserManager<User> _userAdmin;
    private readonly IEmailSender _emailSender;

    public US511Controller(UserManager<User> userAdmin, IEmailSender emailSender)
    {
        _userAdmin = userAdmin;
        _emailSender = emailSender;
    }




        
        [HttpGet]
        public IActionResult RegisterUser()
        {
            ViewBag.Roles = new List<string> { "Admin", "Doctor", "Nurse", "Technician", "Patient" };
            return View();
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegisterUser(RegisterBackofficeUserViewModel model)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await _userAdmin.FindByEmailAsync(model.Email);
                if (existingUser != null)
                {
                    ModelState.AddModelError("Email", "A user with this email already exists.");
                    ViewBag.Roles = new List<string> { "Admin", "Doctor", "Nurse", "Technician", "Patient" };
                    return View(model);
                }

                var user = new User
                {
                    Id = model.Id,
                    Email = model.Email,
                    Role = model.Role,
                    Username = model.Username,
                    Phone = model.Phone
                };

                var result = await _userAdmin.CreateAsync(user);
                if (result.Succeeded)
                {
                    await _userAdmin.AddToRoleAsync(user, model.Role);

                    var token = await _userAdmin.GeneratePasswordResetTokenAsync(user);

                    var callbackUrl = Url.Action(
                        action: "ActivateAccount",
                        controller: "Account",
                        values: new { token = token, email = user.Email },
                        protocol: Request.Scheme);

                    await _emailSender.SendEmailAsync(
                        email: user.Email,
                        subject: "Activate Your Account",
                        htmlMessage: $"Please activate your account by setting your password: <a href='{callbackUrl}'>Activate Account</a>");

                    TempData["Message"] = "User registered successfully. An activation email has been sent.";
                    return RedirectToAction("RegisterUser");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            ViewBag.Roles = new List<string> { "Admin", "Doctor", "Nurse", "Technician", "Patient" };
            return View(model);
        }


        [HttpGet]
        public IActionResult ActivateAccount()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ActivateAccount(ActivateAccountViewModel model)
         {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userAdmin.FindByEmailAsync(model.Email);
            if (user == null)
               {
                return RedirectToAction("ActivationConfirmation");
                           }
                var result = await _userAdmin.ResetPasswordAsync(user, model.Token, model.Password);
                if (result.Succeeded)
                {
                    await _userAdmin.UpdateAsync(user);

                    // Send confirmation email
                    await _emailSender.SendEmailAsync(
                        email: user.Email,
                        subject: "Account Activated",
                        htmlMessage: $"Your account has been successfully activated.");
                    return RedirectToAction("ActivationConfirmation");
                }
                return View(model);
            }

    
}
