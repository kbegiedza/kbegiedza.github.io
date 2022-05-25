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

Pods represents processes running on nodes in the cluster, so it is important to make sure each can gracefully terminate.
To achieve above container runtime sends `STOP` or `TERM` signal (depends on used runtime) followed by `KILL` signal after grace period of time.
Default grace period equals to 30 seconds which can be modified with:
```yaml
spec:
    terminationGracePeriodSeconds: 60
```

You can utilize `preStop` Kubernetes hook and execute command to manage lifetime of your app inside pod before it enters into `Terminated` phase.
This is a great way to shutdown system you don't have control over, thus cannot adjust to handle signals or you want to synchronize shutdown of multiple containers.
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

Your first idea for simple console app could be "Fine! I'll do it all by myself!", then you will search for some nasty `Mono`-based hacks or you will have to attach to events like `Console.CancelKeyPress` (works fine on paper and your computer, not so much inside pod) or utilize application domain's parent process and attach to `AppDomain.CurrentDomain.ProcessExit` event.

Second approach will get things done and will result with following code
```C#
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

Much better approach, even for simple console application, is to utilize modern .NET extensions like `Hosting`, `Logging` and `DependencyInjection`, all three could be added to your project by single [`Microsoft.Extensions.Hosting` package reference](https://www.nuget.org/packages/Microsoft.Extensions.Hosting). This allows you to use feature-rich host lifetime, production ready dependency injection container and great logging framework out-of-the-box while reducing boilerplate code.
After adding above package to project, you should create new host builder, configure it to fit your needs then build it.
It's highly recommended to take a look at [configuration](https://docs.microsoft.com/en-us/dotnet/core/extensions/configuration) and [dependency injection](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) if your aren't familiar with above concepts, it will make your life easier.

```Csharp
using var host = Host.CreateDefaultBuilder()
                     .ConfigureServices(services =>
                     {
                        // Add your services to DI container
                        services.AddHostedService<ImportantService>();
                     })
                     .Build();

await host.RunAsync();
```

Once you have your host ready, you can experiment with 

Before .NET 6, POSIX signals was not fully supported, to handle `SIGTERM` was used previously mentioned `AppDomain.CurrentDomain.ProcessExit` what could raise potential [issues](https://github.com/dotnet/runtime/issues/50397) related with usage of `Environment.Exit`.

You can add graceful shutdown support to your container much easier by injecting `IHostApplicationLifetime` interface, which can be found inside `Microsoft.Extensions.Hosting` package, into your service or controller and then registering delegate that will be called when shutdown request occurs. Due to blocking nature of executing registered action, this solution guarantees required clean-up completion before shutdown.

`IHostApplicationLifetime` interface is not limited to notifying about application lifetime events, but also provides access to `StopApplication()` method which allows you to stop you application gracefully from any place in the code.


#### Webhost application

Some example with controller and pending request ??

### Further reading

1. [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)