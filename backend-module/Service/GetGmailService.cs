using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using MimeKit;
using System.IO;
using System.Management;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace backend_module.Services{



    public class GetGmailService {


    private static GmailService GetMailService()
    { 
        UserCredential credential;
   string credentialPath = @"Service\credentials.json";
 using (var stream = new FileStream(credentialPath, FileMode.Open, FileAccess.Read))
    {
        string tokenPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "token.json");
        credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            GoogleClientSecrets.Load(stream).Secrets,
            new[] { GmailService.Scope.GmailSend },
            "user", CancellationToken.None,
            new FileDataStore(tokenPath, true)).Result;
    }

    // Create Gmail API service.
    var service = new GmailService(new BaseClientService.Initializer()
    {
        HttpClientInitializer = credential,
        ApplicationName = "sem5pi-24-25-g051",
    });

    return service;
    }
    public static async Task SendEmailUsingGmailApi(string toEmail, string subject, string body) {
        var service = GetMailService();

        // Create the email using MimeKit
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("lapr5", "sem5pi2425-g051@gmail.com"));
        emailMessage.To.Add(new MailboxAddress("Activate", toEmail));
        emailMessage.Subject = subject;
        emailMessage.Body = new TextPart("html") { Text = body };

        // Encode the email to Base64
        using (var stream = new MemoryStream()) {
            emailMessage.WriteTo(stream);
            var rawMessage = Convert.ToBase64String(stream.ToArray())
            .Replace('+', '-')
            .Replace('/', '_')
            .Replace("=", "");

            var message = new Message
            {
                Raw = rawMessage
            };

                // Send the email
                await service.Users.Messages.Send(message, "me").ExecuteAsync();
            }

        }
    }
}