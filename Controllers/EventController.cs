using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dens11.Repositories;
using dens11.Data;
using dens11.Models;
using dens11.ViewModels;

[Authorize] // Login olan herkes
public class EventController : Controller
{
    private readonly IEventRepository _eventRepository;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public EventController(
        IEventRepository eventRepository,
        ApplicationDbContext context,
        UserManager<IdentityUser> userManager)
    {
        _eventRepository = eventRepository;
        _context = context;
        _userManager = userManager;
    }

    // 🔹 USER + ORGANIZER → Event Listeleme
    public async Task<IActionResult> Index()
    {
        var events = await _eventRepository.GetAllAsync();

        var model = events.Select(e => new EventViewModel
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.Date,
            CategoryName = e.Category.Name,
            VenueName = e.Venue.Name,
            Capacity = e.Capacity,
            RemainingSeats = e.Capacity - e.Registrations.Count
        }).ToList();

        return View(model);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Join(int eventId)
    {
        var userId = _userManager.GetUserId(User);

        var ev = await _context.Events
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (ev == null)
            return NotFound();

        // Aynı kullanıcı tekrar katılamaz
        if (ev.Registrations.Any(r => r.UserId == userId))
            return BadRequest("Zaten kayıtlısın");

        // Kapasite kontrol
        if (ev.Registrations.Count >= ev.Capacity)
            return BadRequest("Kontenjan dolu");

        var registration = new Registration
        {
            EventId = ev.Id,
            UserId = userId
        };

        _context.Registrations.Add(registration);
        await _context.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }
}
