---
layout: article
date: "2023-05-09"
thumbnail: /assets/img/20230509/title.png
title-image: /assets/img/20230509/title-sm.png
title: Feature management
description: Feature management
categories: dotnet
---

### Abstract

When working with complex system, especially in CI/CD environment, feature toggles, also known as feature flags are used for delivering and/or testing out new changes without compromising whole application for every user. 

There are many techniques for implementing feature toggles, such as simple storing configuration in file / database or using some external service to have ability to manage it with GUI. We will follow the first approach to illustrate idea while minimizing writing integration code and maximising portability of solution.
In this article I would like to focus on Microsoft's offcial open source package `Microsoft.FeatureManagement` (with `Microsoft.FeatureManagement.AspNetCore` designed for use with ASP.NET) and  for managing features, available as [NuGet packageright here](https://www.nuget.org/packages/Microsoft.FeatureManagement/). Thanks to native integration with .NET and utilizing standard `IConfiguration` we can define any configuration provides such as Azure App Configuration, so using this package is great place to start and stick with. 


### Setup

So let's just jump into fresh, newly created application with `dotnet new worker`. We will be using `IHost` based worker for demo purposes since our package is seamless integrated with build in dependency injection framework, which improves quality of life for programmer and scallability for application.

Next step will be adding reference to our package, you can use CLI command `dotnet add package Microsoft.FeatureManagement` or copy and paste package reference directly into your `*.csproj` file.

### Basic usage

As mentioned before we will utilize build-in DI container, so we have to add our feature management to it while configuring services for host:

```c#
var host = Host.CreateDefaultBuilder(args)
               .ConfigureServices(services =>
               {
                   services.AddHostedService<Worker>();

                   services.AddFeatureManagement()
               })
               .Build();
```

This should add feature toggle support for DI builder, so we can proceed to last bit which is consumption of our settings.

To perform check simply you can use snippet below

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

As you can see, in example above, we are using keyword `async` to avoid blocking

Finally, let's drop below json into `appsettings.json` and give it a spin.

```jsonc
{
    // ...
    "FeatureManagement": {
        "ExperimentalAlgorithm": true
    }
}
```

As you probably observed in example, we are adding new feature toggles as new childs of `"FeatureManagement"` object in project's appsettings.
This allows us to check state of concrete feature by refering to it's name and passing it to abstraction over whole feature toggle system represented by `IFeatureManager`.

### Usage in ASP.NET Core

### Filters

### Optional Controller with feature toggles

<!-- Swagger filter Code -->

### Azure App Configuration

### Caching and snapshots

### Further reading

