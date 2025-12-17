using System.ComponentModel.DataAnnotations;

namespace dens11.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
