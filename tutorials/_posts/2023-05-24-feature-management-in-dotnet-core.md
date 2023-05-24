---
layout: article
date: "2023-05-24"
thumbnail: /assets/img/20230524/title-sm.png
title-image: /assets/img/20230524/title.png
title: Feature toggle management in .NET Core
description: Give your application ability to switch behaviour in seconds using official package.
categories: dotnet
---

### Abstract

When working with a complex system, especially in a CI/CD environment, feature toggles, also known as feature flags, are used to deliver and test new changes without compromising the entire application for every user.

There are several techniques for implementing feature toggles, such as storing configurations in a file or database, or using an external service with a GUI for management. In this article, we will focus on Microsoft's official open-source package called `Microsoft.FeatureManagement` (along with its companion package `Microsoft.FeatureManagement.AspNetCore` designed for use with ASP.NET) for managing features. You can find the package on NuGet [here](https://www.nuget.org/packages/Microsoft.FeatureManagement/). This package provides native integration with .NET and utilizes the standard `IConfiguration` interface, allowing you to use various configuration providers like Azure App Configuration. Using this package is a great starting point for patterns like: beta access, opt-in features or dark deployments.

### Setup

For simplicity in this tutorial, we will focus on using `appsettings.json` as our configuration source. However, it's important to note that you can use any `IConfiguration` compatible provider to define your feature flags.

Let's jump right into a freshly created application using `dotnet new worker`. For the purpose of this demo, we will be using an `IHost`-based worker, as our package seamlessly integrates with the built-in dependency injection framework, improving the quality of life for programmers and the scalability of the application.

The next step is to add a reference to our package. You can use the CLI command `dotnet add package Microsoft.FeatureManagement`, or you can directly copy and paste the package reference into your `*.csproj` file.

### Basic usage

As mentioned earlier, we will utilize the built-in DI container. To add our feature management to the DI container while configuring services for the host, you can use the following code:

```csharp
var host = Host.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   services.AddHostedService<Worker>();

                   services.AddFeatureManagement();
               })
               .Build();
```

This code adds feature toggle support to the DI builder. Now, let's proceed to consuming our feature settings.

To perform a feature check, you can use the following code snippet:

```csharp
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IFeatureManager _featureManager;

    public Worker(ILogger<Worker> logger,
                  IFeatureManager featureManager)
    {
        _logger = logger;
        _featureManager = featureManager;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (await _featureManager.IsEnabledAsync("ExperimentalAlgorithm"))
        {
             _logger.LogInformation("I'm using some experimental algorithm!");

            // do experimental stuff...
        }
    }
}
```

In the example above, we are using the `async` keyword to avoid blocking and wait for the feature flag check to complete. This is particularly useful in scenarios where flag check might involve network or I/O operations that could introduce delays.

Finally, let's add the following JSON snippet to `appsettings.json` and give it a spin:

```json
{
    // ...
    "FeatureManagement": {
        "ExperimentalAlgorithm": true
    }
}
```

As you can see in the example, we are adding new feature toggles as children of the `FeatureManagement` object in the project's `appsettings.json`. This allows us to check the state of a specific feature by referring to its name and passing it to the abstraction provided by the `IFeatureManager` interface, which represents the entire feature toggle system.

A good practice when working with feature flags is to maintain a single source of truth for our flags. This makes it easier to refactor and remove flags in the future. To achieve this, you can use an `enum` or a `partial class` with defined `const string` variables instead of using loose strings in multiple places. For example:

```csharp
public static partial class FeatureFlags
{
    public const string ExperimentalAlgorithm = "ExperimentalAlgorithm";
}
```

Remember to plan ahead for the lifetime of your feature flags and remove them when they are no longer needed to avoid dead code.

### Usage in ASP.NET Core

To fully utilize the potential of feature management in ASP.NET Core, we need to add the separate NuGet package [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) to our project using the command `dotnet add package Microsoft.FeatureManagement`.

Once installed, we can easily enable or disable selected controllers using the `FeatureGate` attribute and previously used `appsettings.json` file.

```csharp
[FeatureGate(FeatureFlags.ExperimentalAlgorithm)]
public class ExperimentalController()
{
    // ...
}
```

In the example above, the `FeatureGate` attribute is applied to the `ExperimentalController` class. This attribute allows us to control access to the entire controller based on the state of a specific feature flag. If the feature flag specified in `FeatureFlags.ExperimentalAlgorithm` is enabled in the `appsettings.json`, the controller will be accessible and active. If the feature flag is disabled or not present, the controller will be automatically bypassed.

Using the `FeatureGate` attribute provides a convenient way to control the visibility and behavior of specific controllers based on feature flags. This enables us to gradually roll out new features, conduct A/B testing, or enable experimental functionality in a controlled manner.

### Filters

In addition, our feature management library also offers a powerful extensible filtering mechanism. With this capability, we can leverage various predefined filters, such as the `TimeWindowFilter`, to limit the availability of selected features based on a defined time window. Additionally, we can easily plan ahead and enable new features after a specific date by omitting the `End` parameter in the configuration.

To use the filtering feature, we need to register the appropriate filter in our DI container:

```csharp
var host = Host.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   services.AddHostedService<Worker>();

                   services.AddFeatureManagement()
                           // Register TimeWindowFilter
                           .AddFeatureFilter<TimeWindowFilter>();
               })
               .Build();
```

Next, we need to configure the filter's parameters in our `appsettings.json`:

```json
"FeatureManagement": {
    "ExperimentalAlgorithm": {
        "EnabledFor": [
            {
                "Name": "Microsoft.TimeWindow",
                "Parameters": {
                    "Start": "2023-05-24T17:00:00.0000000+00:00"
                }
            }
        ]
    }
}
```

In this example, the `ExperimentalAlgorithm` feature is configured to be enabled for a specific time window. We specified the `Microsoft.TimeWindow` filter and set only the `Start` parameter to a concrete date.

By utilizing filtering in this way, we can control the availability of features based on various conditions. The library provides several pre-defined filters, and you can also create custom filters and configuration providers to suit your specific needs.

### Further reading
1. [API Reference](https://learn.microsoft.com/en-us/dotnet/api/microsoft.featuremanagement)
2. [Feature filters](https://learn.microsoft.com/en-us/dotnet/api/microsoft.featuremanagement.featurefilters)
3. [Library repository](https://github.com/microsoft/FeatureManagement-Dotnet)
