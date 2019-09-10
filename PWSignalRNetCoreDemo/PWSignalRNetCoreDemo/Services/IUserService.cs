namespace PWSignalRNetCoreDemo.Services
{
    public interface IUserService
    {
        void AddUser(string user, string connectionId);
        void RemoveUser(string connectionId);
        string[] GetUsers();
    }
}