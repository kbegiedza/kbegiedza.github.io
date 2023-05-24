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

When working with complex system, especially in CI/CD environment, feature toggles, also known as feature flags are used for delivering and/or testing out new changes without compromising whole application for every user. 

There are many techniques for implementing feature toggles, such as simple storing configuration in file / database or using some external service to have ability to manage it with GUI. We will follow the first approach to illustrate idea while minimizing writing integration code and maximising portability of solution.
In this article I would like to focus on Microsoft's offcial open source package `Microsoft.FeatureManagement` (and companion `Microsoft.FeatureManagement.AspNetCore` designed for use with ASP.NET) and  for managing features, available as [NuGet packageright here](https://www.nuget.org/packages/Microsoft.FeatureManagement/). Thanks to native integration with .NET and utilizing standard `IConfiguration` we can define any configuration provides such as Azure App Configuration, so using this package is great place to start and stick with. 


### Setup

So let's just jump into fresh, newly created application with `dotnet new worker`. We will be using `IHost` based worker for demo purposes since our package is seamless integrated with build in dependency injection framework, which improves quality of life for programmer and scallability for application.

Next step will be adding reference to our package, you can use CLI command `dotnet add package Microsoft.FeatureManagement` or copy and paste package reference directly into your `*.csproj` file.

### Basic usage

For simplicity in this tutorial we are focusing on using `appsettings.json` but take a note that you can use any `IConfiguration` compatible provider to define feature flags.

As mentioned before we will utilize build-in DI container, so we have to add our feature management to it while configuring services for host:

```c#
var host = Host.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   services.AddHostedService<Worker>();

                   services.AddFeatureManagement();
               })
               .Build();
```

This should add feature toggle support for DI builder, so we can proceed to last bit which is consumption of our settings.

To perform check simply you can use snippet below:

```c#
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

As you can see in example above we are using `async` keyword to avoid blocking.

Finally, let's drop below json into `appsettings.json` and give it a spin.

```jsonc
{
    // ...
    "FeatureManagement": {
        "ExperimentalAlgorithm": true
    }
}
```

As you probably observed in example, we are adding new feature toggles as new child of `FeatureManagement` object in project's appsettings.
This allows us to check state of concrete feature by referring to it's name and passing it to abstraction over whole feature toggle system represented by `IFeatureManager` interface.

Good practice for work with feature flag is maintaining single source of truth for our flags, to allow us easier refactor and flag removal process in future.
To achieve it we can use `enum` or `partial class` with defined `const string` variables instead of throwing loosely strings in few places.

```c#
public static partial class FeatureFlags
{
    public const string ExperimentalAlgorithm = "ExperimentalAlgorithm";
}
```

Remember that we should always plan ahead lifetime of our feature flags and remove them when they aren't needed anymore to avoid dead code.


### Usage in ASP.NET Core

To utilize full potential of feature management in ASP.NET Core we have to add separate NuGet package [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) with `dotnet add package Microsoft.FeatureManagement`.

After installing we can easily enable or disable selected Controllers using `FeatureGate` attribute and good old `appsettings.json`:

```c#
[FeatureGate(FeatureFlags.ExperimentalAlgorithm)]
public class ExperimentalController()
{
    // ...
}
```

### Filters

Our library have bundled one more powerful feature which is extendable filtering. We can make use of multiple predefined filters such as `TimeWindowFilter` to limit availability of selected features based on defined time window (or enable new feature after concrete date by not defining `End` parameter).

To use filtering we have to register proper filter in our DI container:

```c#
var host = Host.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   services.AddHostedService<Worker>();

                   services.AddFeatureManagement()
                           // register TimeWindowFilter
                           .AddFeatureFilter<TimeWindowFilter>();
               })
               .Build();
```

And configure it's parameters in our `appsettings.json`:

```json
"FeatureManagement": {
    "ExperimentalAlgorithm": {
        "EnabledFor": [
            {
                "Name": "Microsoft.TimeWindow",
                "Parameters": {
                    "Start": "Wed, 24 May 2023 17:00:00 UTC",
                }
            }
        ]
    }
}
```

### Further reading
1. [API Reference](https://learn.microsoft.com/en-us/dotnet/api/microsoft.featuremanagement)
2. [Feature filters](https://learn.microsoft.com/en-us/dotnet/api/microsoft.featuremanagement.featurefilters)
3. [Library repository](https://github.com/microsoft/FeatureManagement-Dotnet)
