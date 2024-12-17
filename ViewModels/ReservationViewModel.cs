namespace Library.ViewModels
{
    public class ReservationViewModel
    {
        public int ReservationId { get; set; }
        public string BookTitle { get; set; }
        public DateTime Expires { get; set; }
        public bool Rented { get; set; }
        public string? Username { get; set; }
    }
}
