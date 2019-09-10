using System.Collections.Concurrent;
using System.Linq;

namespace PWSignalRNetCoreDemo.Services
{
    public class UserService : IUserService
    {
        private readonly ConcurrentDictionary<string, string> _userList;

        public UserService()
        {
            _userList = new ConcurrentDictionary<string, string>();
        }

        public void AddUser(string user, string connectionId)
        {
            _userList.TryAdd(connectionId, user);
        }

        public string[] GetUsers()
        {
            return _userList.Values.ToArray();
        }

        public void RemoveUser(string connectionId)
        {
            _userList.TryRemove(connectionId, out string userRemoved);
        }
    }
}