using System;

namespace dens11.ViewModels
{
    public class EventViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string CategoryName { get; set; }
        public string VenueName { get; set; }

        // Kalan kontenjan (Capacity - current registrations)
        public int RemainingSeats { get; set; }

        public int Capacity { get; set; }
    }
}
