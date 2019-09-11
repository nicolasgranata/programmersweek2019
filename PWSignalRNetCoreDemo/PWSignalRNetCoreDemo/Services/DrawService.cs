using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PWSignalRNetCoreDemo.Model;

namespace PWSignalRNetCoreDemo.Services
{
    public class DrawService : IDrawService
    {
        private readonly Stack<Draw> _drawList;

        public DrawService()
        {
            _drawList = new Stack<Draw>();
        }
        public void AddDraw(Draw model)
        {
            _drawList.Push(model);
        }

        public IEnumerable<Draw> GetDraws()
        {
            return _drawList;
        }
    }
}
