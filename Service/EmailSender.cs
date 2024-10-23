using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace sem5pi_24_25_g051.Service;
public class EmailSender : IEmailSender
{    
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var mail = "sem5pi2425g051@gmail.com";  // Your real Gmail address
        var password = "lapr5g051"; // The generated App Password

        var smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(mail, password),
        };

        await smtpClient.SendMailAsync(new MailMessage(from: mail, to: email, subject, message));
    }
}
