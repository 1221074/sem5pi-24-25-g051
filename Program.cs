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
using sem5pi_24_25_g051.Models.User;
using sem5pi_24_25_g051.Infraestructure.Users;
using Microsoft.AspNetCore.Builder;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DBcontext to the container 
builder.Services.AddDbContext<backofficeDbContext>(options =>
    options.UseInMemoryDatabase("BackofficeDatabase"));

// Add repositories to the container
builder.Services.AddScoped<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Add transients to the container
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddTransient<IEmailSender, EmailSender>();

// Add services to the container 
builder.Services.AddScoped<OperationTypeService>();
builder.Services.AddScoped<StaffService>();
builder.Services.AddScoped<UserService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles(); 

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();
app.MapRazorPages();

app.Run();
