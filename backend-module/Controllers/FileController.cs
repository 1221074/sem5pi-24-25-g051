using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.IO.Compression;
using backend_module.Models.File;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class FileController : ControllerBase
{
    private readonly FileService _fileService;

    public FileController(FileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet("download-folder/{folderName}")]
    public async Task<IActionResult> DownloadFolderAsync(string folderName)
    {
        
        var zipFileBytes = await _fileService.GetFolder(folderName);
        return File(zipFileBytes, "application/zip", $"{folderName}.zip");
    }

    [HttpGet("create-folder/{folderName}")]
    [Authorize (Roles = "Admin")]
    public async Task<IActionResult> CreateFolderAsync(string folderName)
    {
        return Ok(await _fileService.CreateFolder(folderName));
    }
}