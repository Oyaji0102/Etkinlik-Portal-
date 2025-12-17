using dens11.Models;

namespace dens11.Repositories
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event> GetByIdAsync(int id);
        Task AddAsync(Event eventItem);
        Task UpdateAsync(Event eventItem);
        Task DeleteAsync(int id);
    }
}
