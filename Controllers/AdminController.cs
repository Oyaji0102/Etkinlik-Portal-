using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dens11.Repositories; // Repository Pattern
using dens11.ViewModels; // View Models (DTO Kuralı)
using dens11.Models; // Entities (Sadece dönüşüm için kullanılır)
using System.Linq;

// [Authorize(Roles = "Admin")] kuralı: Bu Controller'daki tüm aksiyonlara sadece Admin rolü erişebilir.

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IVenueRepository _venueRepository;
    private readonly IEventRepository _eventRepository;


    public AdminController(ICategoryRepository categoryRepository, IVenueRepository venueRepository,
        IEventRepository eventRepository)
    {
        _categoryRepository = categoryRepository;
        _venueRepository = venueRepository;
        _eventRepository = eventRepository;
    }


    // POST: Admin/CreateCategory
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateCategory(CreateCategoryViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var category = new Category
        {
            Name = model.Name
        };

        await _categoryRepository.AddAsync(category);

        return RedirectToAction(nameof(CategoryIndex));
    }

    public IActionResult CreateCategory()
    {
        return View();
    }

    public async Task<IActionResult> CategoryIndex()
    {
        var categories = await _categoryRepository.GetAllAsync();

        var viewModel = categories.Select(c => new CategoryViewModel
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();

        return View(viewModel);
    }

    [HttpGet]
    public async Task<IActionResult> EditCategory(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        var model = new EditCategoryViewModel
        {
            Id = category.Id,
            Name = category.Name
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditCategory(EditCategoryViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var category = await _categoryRepository.GetByIdAsync(model.Id);

        if (category == null)
            return NotFound();

        category.Name = model.Name;

        await _categoryRepository.UpdateAsync(category);

        return RedirectToAction(nameof(CategoryIndex));
    }

    [HttpGet]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        var model = new DeleteCategoryViewModel
        {
            Id = category.Id,
            Name = category.Name
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteCategoryConfirmed(int id)
    {
        await _categoryRepository.DeleteAsync(id);
        return RedirectToAction(nameof(CategoryIndex));
    }

    public async Task<IActionResult> VenueIndex()
    {
        var venues = await _venueRepository.GetAllAsync();

        var viewModel = venues.Select(v => new VenueViewModel
        {
            Id = v.Id,
            Name = v.Name,
            Address = v.Address
        }).ToList();

        return View(viewModel);
    }

    [HttpGet]
    public IActionResult CreateVenue()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateVenue(CreateVenueViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var venue = new Venue
        {
            Name = model.Name,
            Address = model.Address
        };

        await _venueRepository.AddAsync(venue);

        return RedirectToAction(nameof(VenueIndex));
    }

    [HttpGet]
    public async Task<IActionResult> EditVenue(int id)
    {
        var venue = await _venueRepository.GetByIdAsync(id);
        if (venue == null)
            return NotFound();

        var model = new EditVenueViewModel
        {
            Id = venue.Id,
            Name = venue.Name,
            Address = venue.Address
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditVenue(EditVenueViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var venue = await _venueRepository.GetByIdAsync(model.Id);
        if (venue == null)
            return NotFound();

        venue.Name = model.Name;
        venue.Address = model.Address;

        await _venueRepository.UpdateAsync(venue);

        return RedirectToAction(nameof(VenueIndex));
    }

    [HttpGet]
    public async Task<IActionResult> DeleteVenue(int id)
    {
        var venue = await _venueRepository.GetByIdAsync(id);
        if (venue == null)
            return NotFound();

        var model = new DeleteVenueViewModel
        {
            Id = venue.Id,
            Name = venue.Name
        };

        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteVenueConfirmed(int id)
    {
        await _venueRepository.DeleteAsync(id);
        return RedirectToAction(nameof(VenueIndex));
    }


    public async Task<IActionResult> EventIndex()
    {
        var events = await _eventRepository.GetAllAsync();

        var model = events.Select(e => new EventViewModel
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.Date,
            CategoryName = e.Category.Name,
            VenueName = e.Venue.Name,
            RemainingSeats = e.Capacity - (e.Registrations?.Count ?? 0),
            Capacity = e.Capacity
        }).ToList();

        return View(model);
    }

    [HttpGet]
    public async Task<IActionResult> CreateEvent()
    {
        ViewBag.Categories = await _categoryRepository.GetAllAsync();
        ViewBag.Venues = await _venueRepository.GetAllAsync();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateEvent(CreateEventViewModel model)
    {
        if (!ModelState.IsValid)
        {
            ViewBag.Categories = await _categoryRepository.GetAllAsync();
            ViewBag.Venues = await _venueRepository.GetAllAsync();
            return View(model);
        }

        var ev = new Event
        {
            Title = model.Title,
            Date = model.Date,
            Capacity = model.Capacity,
            Description = model.Description,
            CategoryId = model.CategoryId,
            VenueId = model.VenueId
        };

        await _eventRepository.AddAsync(ev);
        return RedirectToAction(nameof(EventIndex));
    }




}