using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Service;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DBcontext to the container 
builder.Services.AddDbContext<PatientContext>(options =>
    options.UseInMemoryDatabase("PatientDatabase"));

builder.Services.AddDbContext<UserContext>(options =>
    options.UseInMemoryDatabase("UserDatabase"));


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
