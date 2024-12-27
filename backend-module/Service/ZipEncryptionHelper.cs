using System.IO;
using System.Text;
using ICSharpCode.SharpZipLib.Zip;

namespace backend_module.Services{
public static class ZipEncryptionHelper
{
    public static byte[] CreateEncryptedZip(string fileContent, string password)
    {
        using var memoryStream = new MemoryStream();

        // SharpZipLib
        using (var zipOutputStream = new ZipOutputStream(memoryStream))
        {
            zipOutputStream.SetLevel(9); 
            zipOutputStream.Password = password;

            var entry = new ZipEntry("patientData.json")
            {
                DateTime = System.DateTime.Now
            };

            zipOutputStream.PutNextEntry(entry);

            // Write the file content into the zip
            byte[] bytes = Encoding.UTF8.GetBytes(fileContent);
            zipOutputStream.Write(bytes, 0, bytes.Length);

            zipOutputStream.CloseEntry();
            zipOutputStream.IsStreamOwner = false; 
            zipOutputStream.Close();
        }

        return memoryStream.ToArray();
    }
}
}
