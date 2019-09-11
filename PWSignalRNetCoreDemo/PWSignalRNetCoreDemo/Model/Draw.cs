using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PWSignalRNetCoreDemo.Model
{
    public class Draw
    {
        public int LastX { get; set; }
        public int LastY { get; set; }
        public int CurrentX { get; set; }
        public int CurrentY { get; set; }
        public string Color { get; set; }
        public string Tool { get; set; }
    }
}
