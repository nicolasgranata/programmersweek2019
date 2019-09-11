using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PWSignalRNetCoreDemo.Model;

namespace PWSignalRNetCoreDemo.Services
{
    public class DrawService : IDrawService
    {
        private readonly Queue<Draw> _drawList;

        public DrawService()
        {
            _drawList = new Queue<Draw>();
        }
        public void AddDraw(Draw model)
        { 
            if(_drawList.Count > 5000)
            {
                _drawList.Dequeue();
            }

            _drawList.Enqueue(model);
        }

        public IEnumerable<Draw> GetDraws()
        {
            return _drawList;
        }
    }
}
