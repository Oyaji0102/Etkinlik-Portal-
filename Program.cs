// 1. GEREKLÝ KÜTÜPHANELER (USINGS)
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using dens11.Data; // DbContext ve SeedData
using dens11.Repositories; // Repository Pattern
using dens11.Models; // Modeller (IdentityUser'ý kullanmak için dolaylý yoldan gerekli)


var builder = WebApplication.CreateBuilder(args);

// 2. VERÝTABANI BAÐLANTISI VE EF CORE AYARLARI (ÖDEV KURALI)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// A. DbContext'i Kaydetme (SQLite kullanýlarak)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// B. Identity Servisini Rol Desteði ile Kaydetme (GÜVENLÝK KURALI)
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount =false)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllersWithViews();

// C. Repository Pattern Kayýtlarý (BEST PRACTICES KURALI)
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IVenueRepository, VenueRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();

// D. Identity sayfalarý için Razor Pages servisini ekleme
builder.Services.AddRazorPages();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Identity/Account/Login";
    options.LogoutPath = "/Identity/Account/Logout";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint(); // Geliþtirme sýrasýnda Migrations hatalarýný gösterir
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 3. ROL BAÞLANGICI VE SEED DATA ÝÞLEMÝ (GÜVENLÝK VE ROL KURALI)
app.UseAuthentication();
app.UseAuthorization(); // Yetkilendirme (Authorization) hattýný baþlatýr

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Admin, Kullanýcý, Organizatör rollerini ve Admin kullanýcýsýný oluþturur.
        await SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabaný baþlatýlýrken bir hata oluþtu.");
    }
}
// ----------------------------------------------------------------------


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages(); // Identity sayfalarýnýn (Register, Login) çalýþmasý için zorunludur.

app.Run();