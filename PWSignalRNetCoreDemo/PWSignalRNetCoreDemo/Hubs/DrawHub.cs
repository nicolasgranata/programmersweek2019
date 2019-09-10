using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PWSignalRNetCoreDemo.Hubs
{
    public class DrawHub : Hub
    {
        public Task Draw(int lastX, int lastY, int currentX, int currentY, string color, string tool)
        {
            return Clients.Others.SendAsync("draw", lastX, lastY, currentX, currentY, color, tool);
        }
    }
}
