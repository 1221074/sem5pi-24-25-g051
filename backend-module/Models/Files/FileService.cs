using System;
using System.IO.Compression;
using backend_module.Models.Shared;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend_module.Models.File {
    public class FileService {

        private readonly IUnitOfWork _unitOfWork;

        public FileService(IUnitOfWork unitOfWork) {
            _unitOfWork = unitOfWork;
        }

        public async Task<byte[]> GetFolder(string folderName) {
            var folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, folderName);

            if (!Directory.Exists(folderPath))
            {
                throw new BusinessRuleValidationException("Folder not found");
            }

            var zipFilePath = Path.Combine(Path.GetTempPath(), $"{folderName}.zip");

            if (System.IO.File.Exists(zipFilePath))
            {
                System.IO.File.Delete(zipFilePath);
            }

            ZipFile.CreateFromDirectory(folderPath, zipFilePath);

            return System.IO.File.ReadAllBytes(zipFilePath);
         
        }

        public async Task<string> CreateFolder(string folderName) {
            var folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, folderName);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            return folderPath;

        }

    }
        
        

}