using ConnectionDll;

namespace PES_LITE.WEB.Infrastructure.Data.ExternalSources;

public class OracleService
{
    public string GetConnectionString()
    {
        var provider = new Class1();
        return provider.oracon.ConnectionString;
    }

}
