using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace dens11.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            // 1. Rolleri Oluşturma (Admin, Kullanıcı, Organizatör)
            await EnsureRole(roleManager, "Admin");
            await EnsureRole(roleManager, "Kullanıcı");
            await EnsureRole(roleManager, "Organizatör");

            // 2. İlk Admin Kullanıcısını Oluşturma
            await EnsureAdminUser(userManager);

            // 3. İlk Normal Kullanıcıyı Oluşturma
            await EnsureNormalUser(userManager);
        }

        private static async Task EnsureRole(RoleManager<IdentityRole> roleManager, string roleName)
        {
            if (await roleManager.FindByNameAsync(roleName) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        private static async Task EnsureAdminUser(UserManager<IdentityUser> userManager)
        {
            const string adminEmail = "admin@odev.com";
            const string adminPassword = "Admin123!";
            const string adminRole = "Admin";

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
            }
        }

        private static async Task EnsureNormalUser(UserManager<IdentityUser> userManager)
        {
            const string userEmail = "user@odev.com";
            const string userPassword = "User123!";
            const string userRole = "Kullanıcı";

            if (await userManager.FindByEmailAsync(userEmail) == null)
            {
                var normalUser = new IdentityUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(normalUser, userPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(normalUser, userRole);
                }
            }
        }
    }
}