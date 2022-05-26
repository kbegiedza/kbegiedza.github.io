---
layout: article
date: "2022-05-20"
thumbnail: /assets/img/placeholder/title-sm.png
title-image: /assets/img/placeholder/title.png
title: Story about graceful termination with .NET
description: Graceful termination of .NET based pods in Kubernetes environment
categories: dotnet devops kubernetes
---

### Abstract

Pods represents processes running on nodes in the cluster, each pod could be terminated anytime, for instance during new version rollout, so it's good practice for your app to be able to gracefully terminate itself.
Right before termination, container runtime sends signal (depends on used runtime: `SIGSTOP` or `SIGTERM`) followed by `SIGKILL` signal after grace period of time.    
Default grace period equals to 30 seconds which can be modified in pod's specification:
```yaml
spec:
    terminationGracePeriodSeconds: 60
```

You can utilize `preStop` Kubernetes hook and execute command to manage lifetime of your app inside pod before it enters into `Terminated` phase.
This is a great way to shutdown system you don't have control over, thus cannot adjust it to handle signals or you want to synchronize shutdown of multiple containers.
```yaml
spec:
  containers:
  - name: sidecar
    image: busybox
    lifecycle:
      preStop:
        exec:
          command: [ "/bin/sh", "-c", "echo 'Executing PreStop hook'" ]
```

Another way to handle termination gracefully is to observe and react to described previously system signals sent down directly to process by container runtime and this post is all about how to do it with .NET 6 and ASP.NET Core 6.0.

Regardless of which described above method you choose, you have to make sure that it finishes its execution before defined `terminationGracePeriodSeconds`,
otherwise your pod will be force killed by runtime.

### Graceful termination in .NET


#### Fast and simple way

Your first idea for simple console app could be "Fine! I'll do it all by myself!", then you will search for some nasty Mono-based hacks or you will manually attach to events like `Console.CancelKeyPress` (works fine on paper and your computer, not so much inside pod) or utilize application domain's parent process and attach to `AppDomain.CurrentDomain.ProcessExit` event.

Second approach will result with following code and get things done.
```c#
protected override async Task ExecuteAsync()
{
    AppDomain.CurrentDomain.ProcessExit += OnProcessExit;
}

private void OnProcessExit(object? sender, EventArgs e)
{
    Console.WriteLine($"Got {nameof(OnProcessExit)}");
}
```

As expected you will get output like one below:
```
Starting: 'ConsoleEventsRunner'.
Got OnProcessExit
```

But... you deserve better!

#### Host-based console application

Much better approach, even for simple console application, is to utilize modern .NET extensions like `Hosting`, `Logging` and `DependencyInjection`. All three packages could be added to your project by single [`Microsoft.Extensions.Hosting` package reference](https://www.nuget.org/packages/Microsoft.Extensions.Hosting). This allows you to use feature-rich host lifetime, production ready dependency injection container and great logging framework out-of-the-box while reducing boilerplate code.
Inside this 
After adding package to project, you are ready to create new host builder, configure it to fit your needs and then build it like in example below.   

```c#
public class FooHostedService : IHostedService
{
  // ... implementation
}

using var host = Host.CreateDefaultBuilder()
                     .ConfigureServices(services =>
                     {
                        // Add your services to DI container
                        services.AddHostedService<FooHostedService>();
                     })
                     .Build();

await host.RunAsync();
```

If your aren't familiar with above concepts, it's highly recommended for you to take a look at [configuration](https://docs.microsoft.com/en-us/dotnet/core/extensions/configuration) and [dependency injection](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) description, it will make your life easier.

Once you have host-based, easily configurable console application with DI enabled with close to zero cost you can utilize another interesting feature hidden under `IHostApplicationLifetime` interface inside `Microsoft.Extensions.Hosting` package. Graceful shutdown support can be added by simply injecting this interface into your service or controller and registering delegate that will be called when shutdown request occurs. Due to blocking nature of executing registered action, this solution guarantees required clean-up completion before shutdown.    
To better represent this feature please take look at following code and its output

```c#
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using var host = Host.CreateDefaultBuilder()
                     .ConfigureServices(services =>
                     {
                         services.AddHostedService<ImportantService>();
                     })
                     .Build();

await host.RunAsync();

public class ImportantService : BackgroundService
{
    private readonly ILogger _logger;

    // use of dependency injection ILogger and IHostApplicationLifetime
    public ImportantService(ILogger<ImportantService> logger,
                            IHostApplicationLifetime applicationLifetime)
    {
        _logger = logger;

        // register to lifetime callbacks
        applicationLifetime.ApplicationStarted.Register(OnStarted);
        applicationLifetime.ApplicationStopped.Register(OnStopped);
        applicationLifetime.ApplicationStopping.Register(OnStopping);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Doing very important stuff...");

            await Task.Delay(TimeSpan.FromSeconds(1));
        }

        _logger.LogInformation("Oops, cancellation was requested!");
    }

    private void OnStarted()
    {
        _logger.LogInformation($"Executing: {nameof(OnStarted)}, I should get ready to work!");
    }

    private void OnStopping()
    {
        _logger.LogInformation($"Executing: {nameof(OnStopping)}, I should block stopping and clean up!");
    }

    private void OnStopped()
    {
        _logger.LogInformation($"Executing: {nameof(OnStopped)}, I should stop!");
    }
}
```

Executing this code and killing pod after a while will results with:

```
info: Sharpbox.Graceful.Services.ImportantService[0]
      Doing very important stuff...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Executing: OnStarted, I should get ready to work!
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /app
info: Sharpbox.Graceful.Services.ImportantService[0]
      Doing very important stuff...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Doing very important stuff...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Doing very important stuff...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Doing very important stuff...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Executing: OnStopping, I should block stopping and clean up!
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
info: Sharpbox.Graceful.Services.ImportantService[0]
      Oops, cancellation was requested!
info: Sharpbox.Graceful.Services.ImportantService[0]
      Executing: OnStopped, I should stop!
```

`IHostApplicationLifetime` interface is not limited to notifying about application lifetime events, but also provides access to `StopApplication()` method which allows you to stop you application gracefully from any place in the code.

Note that POSIX signals were not fully supported before .NET 6, for instance, to handle `SIGTERM` was used previously mentioned `AppDomain.CurrentDomain.ProcessExit` what could lead to potential [issues](https://github.com/dotnet/runtime/issues/50397) related with usage of `Environment.Exit`.   
If your application still uses `Environment.Exit` you should probably move to `IHostApplicationLifetime` or stick with attaching to `AppDomain.CurrentDomain.ProcessExit` event.
Unlike .NET Framwork, modern .NET doesn't have any timeout defined for execution of `ProcessExit` event handlers.

#### Webhost application

Modern ASP.NET 6 applications uses `IHost` and `IServer` hosting by default which makes use of `IHostApplicationLifetime` pretty straightforward.
Similar to above `ImportantService` example, you should inject `IHostApplicationLifetime` to your controller (or other service), register to proper callback and execute operations 
required for your application to achieve graceful shutdown.

```
```

### Further reading

1. [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)