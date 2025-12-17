using System.ComponentModel.DataAnnotations;

namespace dens11.ViewModels
{
    public class CreateCategoryViewModel
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}
