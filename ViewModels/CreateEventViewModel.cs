using System;
using System.ComponentModel.DataAnnotations;

namespace dens11.ViewModels
{
    public class CreateEventViewModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Range(1, 10000)]
        public int Capacity { get; set; }

        public string? Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int VenueId { get; set; }
    }
}
