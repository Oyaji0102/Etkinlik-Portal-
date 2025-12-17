using Microsoft.EntityFrameworkCore;
using dens11.Data;
using dens11.Models;

namespace dens11.Repositories
{
    public class VenueRepository : IVenueRepository
    {
        private readonly ApplicationDbContext _context;

        public VenueRepository(ApplicationDbContext context) // DI Kuralı
        {
            _context = context;
        }

        public async Task<IEnumerable<Venue>> GetAllAsync()
        {
            return await _context.Venues.ToListAsync();
        }

        public async Task<Venue> GetByIdAsync(int id)
        {
            return await _context.Venues.FindAsync(id);
        }

        public async Task AddAsync(Venue venue)
        {
            await _context.Venues.AddAsync(venue);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Venue venue)
        {
            _context.Venues.Update(venue);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var venue = await _context.Venues.FindAsync(id);
            if (venue != null)
            {
                _context.Venues.Remove(venue);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.Venues.AnyAsync(e => e.Id == id);
        }
    }
}