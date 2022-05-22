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

1. Console app -> without host
2. Host-based

### Further reading

1. [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)