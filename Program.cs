using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Infraestructure;
using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Service;
using sem5pi_24_25_g051.Infraestructure.OperationTypes;
using sem5pi_24_25_g051.Infrastructure.Staff_;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Infraestructure.Shared;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DBcontext to the container 
builder.Services.AddDbContext<backofficeDbContext>(options =>
    options.UseInMemoryDatabase("BackofficeDatabase"));

builder.Services.AddScoped<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<OperationTypeService>();
builder.Services.AddScoped<StaffService>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5280); // Bind to IPv4 localhost (127.0.0.1) for HTTP
    options.ListenLocalhost(7252, listenOptions => // Bind to IPv4 localhost (127.0.0.1) for HTTPS
    {
        listenOptions.UseHttps();
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

app.UseAuthorization();

app.MapControllers();

app.Run();
