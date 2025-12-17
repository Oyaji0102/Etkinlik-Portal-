using System.ComponentModel.DataAnnotations;

namespace dens11.ViewModels
{
    public class EditCategoryViewModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}
