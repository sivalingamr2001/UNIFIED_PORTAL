using PES_LITE.Infrastructure;
using PES_LITE.WEB.Infrastructure.Data.ExternalSources;
using PES_LITE.WEB.Interfaces;
using PES_LITE.WEB.Services;
using Scalar.AspNetCore;
using Serilog;

namespace PES_LITE.WEB;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.AddCustomSerilog();

        // --- Clean DI Layer Separated Wire-up ---
        builder.Services.AddScoped<OracleService>();

        // One clean registration that encapsulates Dapper and Oracle factories seamlessly
        builder.Services.AddOracleDataAccess();

        builder.Services.AddScoped<IPesServices, PesServices>();
        builder.Services.AddScoped<ICommodityServices, CommodityServices>();
        // ----------------------------------------

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger(options =>
            {
                options.RouteTemplate = "openapi/{documentName}.json";
            });

            app.MapScalarApiReference(options =>
            {
                options.WithTitle("PES_LITE API Reference")
                       .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
            });
        }

        app.UseCors();
        app.UseHttpsRedirection();
        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.MapControllers();
        app.MapFallbackToFile("index.html");

        try
        {
            app.Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
