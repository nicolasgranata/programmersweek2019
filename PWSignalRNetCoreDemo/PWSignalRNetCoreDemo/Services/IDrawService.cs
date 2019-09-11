using PWSignalRNetCoreDemo.Model;
using System.Collections.Generic;

namespace PWSignalRNetCoreDemo.Services
{
    public interface IDrawService
    {
        void AddDraw(Draw model);
        IEnumerable<Draw> GetDraws();
    }
}
