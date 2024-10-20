using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Infraestructure;
using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Service;
using sem5pi_24_25_g051.Infraestructure.OperationTypes;
using sem5pi_24_25_g051.Models.OperationType;
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

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<OperationTypeService>();

var app = builder.Build();


app.UseHttpsRedirection();

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
