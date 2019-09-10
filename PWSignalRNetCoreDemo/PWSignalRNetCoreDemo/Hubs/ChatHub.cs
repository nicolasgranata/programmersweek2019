using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using PWSignalRNetCoreDemo.Hubs.Interfaces;
using PWSignalRNetCoreDemo.Services;

namespace PWSignalRNetCoreDemo.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IUserService _userService;

        public ChatHub(IUserService userService)
        {
            _userService = userService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.ReceiveMessage(user, message);
        }

        public async Task NewUser(string user)
        {
            _userService.AddUser(user, Context.ConnectionId);
            await Clients.Others.UpdateUsers(user);
        }

        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.ReceiveMessage(message);
        }

        public override Task OnConnectedAsync()
        {
            return Clients.Caller.ReceiveConnectedUsers(_userService.GetUsers());
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            _userService.RemoveUser(Context.ConnectionId);
            return Clients.Others.ReceiveConnectedUsers(_userService.GetUsers());
        }
    }
}