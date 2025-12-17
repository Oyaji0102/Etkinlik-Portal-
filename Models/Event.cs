using System.ComponentModel.DataAnnotations;

namespace dens11.Models
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public int Capacity { get; set; }

        public string? Description { get; set; }

        // FK
        public int CategoryId { get; set; }
        public int VenueId { get; set; }

        // Navigation
        public Category Category { get; set; }
        public Venue Venue { get; set; }

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();

    }
}
