using System;
using System.Diagnostics;
using System.IO;
using Microsoft.Data.SqlClient;
public class BackupService
{


    private readonly string connectionString;

    public BackupService(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public void RunBackup()
    {
        // Create backup directory if it doesn't exist
        string backupDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"../../../Backups"); // Modify this to your desired directory
        if (!Directory.Exists(backupDir))
        {
            Directory.CreateDirectory(backupDir);
        }

        // Determine if today is the day for a full backup (e.g., Sunday)
        bool isFullBackupDay = DateTime.Now.DayOfWeek == DayOfWeek.Sunday;

        string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        string backupFile = Path.Combine(backupDir, $"Backup_{timestamp}.bak");

        string backupCmd;

        if (isFullBackupDay)
        {
            // Full backup command
            backupCmd = $"BACKUP DATABASE [LAPR5] TO DISK = '{backupFile}' WITH FORMAT, INIT, SKIP, NOREWIND, NOUNLOAD, STATS = 10";
        }
        else
        {
            // Differential backup command
            backupCmd = $"BACKUP DATABASE [LAPR5] TO DISK = '{backupFile}' WITH DIFFERENTIAL, INIT, SKIP, NOREWIND, NOUNLOAD, STATS = 10";
        }

        ExecuteBackup(backupCmd,backupFile);
    }

     private void ExecuteBackup(string backupCmd, string backupFile)
    {
        try
        {
            using (var connection = new SqlConnection(connectionString))
            {
                using (var command = new SqlCommand(backupCmd, connection))
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                    Console.WriteLine($"Backup completed successfully. File: {backupFile}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during backup: {ex.Message}");
        }

        // Check if the file was actually created
        if (File.Exists(backupFile))
        {
            Console.WriteLine($"Backup file exists: {backupFile}");
        }
        else
        {
            Console.WriteLine($"Backup file was not created: {backupFile}");
        }
    }
}