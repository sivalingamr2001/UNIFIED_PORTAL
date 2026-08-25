using Serilog;
using Serilog.Events;

namespace PES_LITE.WEB;

public static class LoggerExtension
{
    public static void AddCustomSerilog(this IHostBuilder host)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Verbose()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            // Console Sink
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
            // 1. Trace / Verbose File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Verbose)
                .WriteTo.File("Logs/trace-.txt", rollingInterval: RollingInterval.Day))
            // 2. Debug File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Debug)
                .WriteTo.File("Logs/debug-.txt", rollingInterval: RollingInterval.Day))
            // 3. Information File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Information)
                .WriteTo.File("Logs/info-.txt", rollingInterval: RollingInterval.Day))
            // 4. Warning File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Warning)
                .WriteTo.File("Logs/warning-.txt", rollingInterval: RollingInterval.Day))
            // 5. Error File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Error)
                .WriteTo.File("Logs/error-.txt", rollingInterval: RollingInterval.Day))
            // 6. Critical / Fatal File
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == LogEventLevel.Fatal)
                .WriteTo.File("Logs/critical-.txt", rollingInterval: RollingInterval.Day))
            .CreateLogger();

        host.UseSerilog();
    }
}
