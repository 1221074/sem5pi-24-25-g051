using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace sem5pi_24_25_g051.Service;
public class EmailSender : IEmailSender
{
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var mail = "";
        var password = "";

        var smtpClient = new SmtpClient("smtp.gmail.com", 587) {   
            EnableSsl = true,
            Credentials = new NetworkCredential(mail, password),
        };

      await smtpClient.SendMailAsync(new MailMessage(from: mail, to: email, subject, message));



    }
}
