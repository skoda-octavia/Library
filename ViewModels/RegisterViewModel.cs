using System.ComponentModel.DataAnnotations;

namespace Library.ViewModels
{
    public class RegisterViewModel
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

        [Required(ErrorMessage = "Password required")]
        [StringLength(40, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 40 characters")]
        [DataType(DataType.Password)]
        [Compare("ConfirmPassword", ErrorMessage = "Password must match confirmed password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password required")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
