using Microsoft.AspNetCore.Identity;

namespace dens11.Models
{
    public class Registration
    {
        // Composite Key olacak (DbContext'te tanımlı)
        public int EventId { get; set; }
        public Event Event { get; set; }

        public string UserId { get; set; }
        public IdentityUser User { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.Now;
    }
}
