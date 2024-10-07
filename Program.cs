using sem5pi_24_25_g051.Domain;
using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Service;
using Microsoft.AspNetCore.Identity.UI.Services;
using sem5pi_24_25_g051.Domain.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.AddControllersWithViews(); 

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.MapControllers(); 
app.MapRazorPages();

app.Run();
