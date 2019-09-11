using Microsoft.AspNetCore.SignalR;
using PWSignalRNetCoreDemo.Model;
using PWSignalRNetCoreDemo.Services;
using System.Threading.Tasks;

namespace PWSignalRNetCoreDemo.Hubs
{
    public class DrawHub : Hub
    {
        private readonly IDrawService _drawService;

        public DrawHub(IDrawService drawService)
        {
            _drawService = drawService;
        } 
        public Task Draw(int lastX, int lastY, int currentX, int currentY, string color, string tool, string lineWidth)
        {
            _drawService.AddDraw(new Draw { LastX = lastX, LastY = lastY, CurrentX = currentX, CurrentY = currentY, Color = color, Tool = tool, LineWidth = lineWidth });
            return Clients.Others.SendAsync("draw", lastX, lastY, currentX, currentY, color, tool, lineWidth);
        }

        public override Task OnConnectedAsync()
        {
            return Clients.Caller.SendAsync("receiveDraw", _drawService.GetDraws());
        }
    }
}
