using Microsoft.EntityFrameworkCore;
using backend_module.Infraestructure;
using backend_module.Infraestructure.OperationTypes;
using backend_module.Infrastructure.Staffs;
using backend_module.Infrastructure.Specializations;
using backend_module.Models.OperationType;
using backend_module.Models.Staff;
using backend_module.Models.Specialization;
using backend_module.Models.SurgeryRoom;
using backend_module.Models.Shared;
using backend_module.Models.User;
using backend_module.Models.Patient;
using backend_module.Models.File;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using backend_module.Models.OperationRequest;
using backend_module.Infraestructure.Users;
using backend_module.Infraestructure.OperationRequests;
using backend_module.Infraestructure.SurgeryRooms;
using backend_module.Infrastructure.Patients;
using System.Security.Claims;
using backend_module.Services;
using MongoDB.Driver;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// Set up configuration sources
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add DBcontext to the container 
builder.Services.AddDbContext<backofficeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

  // Configuração do MongoDB
    var mongoClient = new MongoClient(builder.Configuration.GetConnectionString("MongoDB"));
    var mongoDatabase = mongoClient.GetDatabase("mongoadmin");

builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);


builder.Services.AddScoped<IOperationRequestRepository, OperationRequestRepository>();
builder.Services.AddScoped<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<ISurgeryRoomRepository, SurgeryRoomRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<OperationTypeService>();
builder.Services.AddScoped<StaffService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<OperationRequestService>();
builder.Services.AddScoped<SpecializationService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<SurgeryRoomService>();
BackupService backupService = new BackupService(builder.Configuration.GetConnectionString("DefaultConnection"));
        backupService.RunBackup();


builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ServerFrontend",
        builder => builder.WithOrigins("http://vs743.dei.isep.ipp.pt:4000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5000",
    builder => builder.WithOrigins("http://localhost:5000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost4000",
    builder => builder.WithOrigins("http://localhost:4000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());
});



builder.Services.AddAuthentication(option =>
{
    option.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
}).AddCookie().AddGoogle(options =>
{
    IConfigurationSection googleAuthNSection = builder.Configuration.GetSection("Authentication:Google");
    options.ClientId = googleAuthNSection["ClientId"] ?? throw new InvalidOperationException("Google ClientId is not configured.");
    options.ClientSecret = googleAuthNSection["ClientSecret"] ?? throw new InvalidOperationException("Google ClientSecret is not configured.");
    //options.SaveTokens = true;
     options.Events.OnCreatingTicket = async context =>
    {
        // Add your async code here, for example:
        var unitOfWork = context.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
        var userRepository = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        UserService _service = new UserService(unitOfWork, userRepository);
        var PatientRepository = context.HttpContext.RequestServices.GetRequiredService<IPatientRepository>();
        PatientService _servicePatient = new PatientService(PatientRepository, unitOfWork,  context.HttpContext.RequestServices.GetRequiredService<IMongoDatabase>());

        var email = context.Principal.FindFirst(ClaimTypes.Email)?.Value;
        UserDto user = await _service.GetByEmailAsync(email);
        string role;
        if (user == null){
            PatientDTO patient = await _servicePatient.GetByEmailAsync(email);
            if (patient != null){

                if (!await _servicePatient.CheckActive(patient.Id)){
                    try
                    {
                        // Create the user with Active set to false
                        
                        var token = Guid.NewGuid().ToString();

                        //await _service.SaveActivationTokenAsync(createdUser.Nif, token);

                        var confirmationLink = $"{context.Request.Scheme}://{context.Request.Host}/api/patient/confirm?id={patient.Id}&token={Uri.EscapeDataString(token)}";
                        var emailBody = $@" <html><body><p>Please activate your account by clicking the button below:</p><a href=""{confirmationLink}"" style=""display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-align: center; text-decoration: none; border-radius: 5px;"">Activate Account</a></body></html>";

                        // Send the email using Gmail API
                        await GetGmailService.SendEmailUsingGmailApi(patient.Email, "Activate your account", emailBody);
                        
                        
                    } catch (Exception ex) {
                        context.Response.StatusCode = 500;
                        await context.Response.WriteAsync($"Failed to send email: {ex.Message}");
                    } 

                    
                }



               
            }
            role = "Patient";
        } else {
            role = RoleTypeExtensions.GetRoleDescription(user.Role);
        }

        

        var roleClaim = new Claim(ClaimTypes.Role, role);
        var claimsIdentity = (ClaimsIdentity)context.Principal.Identity;
        claimsIdentity.AddClaim(roleClaim); 

    


        //claim
    };
    
    
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5280); // HTTP port
    options.ListenAnyIP(7252, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS port with SSL
    });
});



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalhost4000");
app.UseCors("AllowLocalhost5000");
app.UseCors("ServerFrontend");

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();
app.Run();