using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using DynamicTransaction.Interfaces;
using DynamicTransaction.Services;
using PES_LITE.Infrastructure.Data;
using PES_LITE.WEB.Infrastructure.Data.ExternalSources;

namespace PES_LITE.Infrastructure;

public static class InfrastructureRegistrationExtensions
{
    public static IServiceCollection AddOracleDataAccess(this IServiceCollection services)
    {
        services.AddScoped<IDbConnectionFactory>(provider =>
        {
            var oracleService = provider.GetRequiredService<OracleService>();
            string connectionString = oracleService.GetConnectionString();
            return new AppOracleDbConnectionFactory(connectionString);
        });

        services.TryAddScoped<IDynamicQueryExecutor, DynamicQueryExecutor>();

        return services;
    }
}
