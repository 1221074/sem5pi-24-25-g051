using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Infraestructure;
using sem5pi_24_25_g051.Infraestructure.OperationTypes;
using sem5pi_24_25_g051.Infrastructure.Staffs;
using sem5pi_24_25_g051.Infrastructure.Specializations;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Specialization;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Infraestructure.Users;
using sem5pi_24_25_g051.Infraestructure.OperationRequests;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DBcontext to the container 
builder.Services.AddDbContext<backofficeDbContext>(options =>
    options.UseSqlite("Data Source=lapr5.db"));

builder.Services.AddScoped<IOperationRequestRepository, OperationRequestRepository>();
builder.Services.AddScoped<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<OperationTypeService>();
builder.Services.AddScoped<StaffService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<OperationRequestService>();
builder.Services.AddScoped<SpecializationService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

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
    options.SaveTokens = true;
     options.Events.OnCreatingTicket = async context =>
    {
        // Add your async code here, for example:
        var unitOfWork = context.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
        var userRepository = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        UserService _service = new UserService(unitOfWork, userRepository);
        var email = context.Principal.FindFirst(ClaimTypes.Email)?.Value;
        UserDto user = await _service.GetByEmailAsync(email);
                Console.WriteLine($"User {email} logged");
                Console.WriteLine($"User: {user.Email}");
                Console.WriteLine($"Role: {user.Role.ToString()}");
        string role = RoleTypeExtensions.GetRoleDescription(user.Role);
                Console.WriteLine($"Role: {role}");


        var roleClaim = new Claim(ClaimTypes.Role, role);
        var claimsIdentity = (ClaimsIdentity)context.Principal.Identity;
        claimsIdentity.AddClaim(roleClaim); 

    


        //claim
    };
    
    
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5280); // HTTP port
    options.ListenLocalhost(7252, listenOptions =>
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

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();
app.Run();
