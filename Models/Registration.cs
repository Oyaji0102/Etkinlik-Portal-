using Microsoft.AspNetCore.Identity;

namespace dens11.Models
{
    public class Registration
    {
        // Composite Primary Key için anahtarlar
        public int EventId { get; set; }
        public string UserId { get; set; }

        public Event Event { get; set; }
        public IdentityUser User { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;
    }
}