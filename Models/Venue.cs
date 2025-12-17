using System.ComponentModel.DataAnnotations;

namespace dens11.Models
{
    public class Venue
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        public string Address { get; set; }

        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
