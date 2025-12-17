using System.ComponentModel.DataAnnotations;

namespace dens11.ViewModels
{
    public class CreateVenueViewModel
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(200)]
        public string Address { get; set; }
    }
}
