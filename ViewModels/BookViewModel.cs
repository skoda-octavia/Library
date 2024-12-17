using System.ComponentModel.DataAnnotations;

namespace Library.ViewModels
{
    public class BookViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tytuł jest wymagany")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Wydawca jest wymagany")]
        public string Publisher { get; set; }

        [Required(ErrorMessage = "Autor jest wymagany")]
        public string Author { get; set; }

        [DataType(DataType.Date)]
        public DateTime Published { get; set; }

        [Required(ErrorMessage = "Cena jest wymagana")]
        [RegularExpression(@"^(\d+([,.]\d{1,2})?)$", ErrorMessage = "Podaj prawidłową cenę w formacie X.XX lub X,XX.")]
        public string Price { get; set; }

        public bool Rented { get; set; } = false;

        public bool Unavailable { get; set; } = false;
        public string RowVersion { get; set; } = "";
    }
}
