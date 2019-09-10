using System.Threading.Tasks;

namespace PWSignalRNetCoreDemo.Hubs.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(string user, string message);
        Task ReceiveMessage(string message);
        Task NewUser(string user);
        Task UpdateUsers(string user);
        Task ReceiveConnectedUsers(string[] users);
    }
}