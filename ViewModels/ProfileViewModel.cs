using System.ComponentModel.DataAnnotations;

namespace Library.ViewModels
{
    public class ProfileViewModel
    {
        [Required(ErrorMessage = "Username required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Field must be between 3 and 100 characters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "First name required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Field must be between 3 and 100 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Field must be between 3 and 100 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Phone name required")]
        [Phone]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Email required")]
        [EmailAddress]
        public string Email { get; set; }
    }
}
