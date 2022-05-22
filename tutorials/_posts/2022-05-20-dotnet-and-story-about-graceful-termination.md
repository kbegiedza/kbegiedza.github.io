---
layout: article
date: "2022-05-20"
thumbnail: /assets/img/placeholder/title-sm.png
title-image: /assets/img/placeholder/title.png
title: Story about graceful termination with .NET
description: Graceful termination of .NET based pods in kubernetes environment
categories: dotnet devops
---

https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
https://blog.markvincze.com/graceful-termination-in-kubernetes-with-asp-net-core/
https://www.thinktecture.com/en/asp-net-core/aspnet-core-in-production-graceful-shutdown-and-reacting-to-aborted-requests/

### Abstract

In modern dotnet you have multiple ways to host your application.

Pods represents processes running on nodes in the cluster, so it is important to make sure each can gracefully terminate.
To achieve above container runtime sends `STOP` or `TERM` signal (depends on used runtime) followed by `KILL` signal after grace period of time.
Default grace period equals to 30 seconds which can be modified with:
```yaml
spec:
    terminationGracePeriodSeconds: 60
```

You can use `preStop` Kubernetes hook to execute command to manage lifetime of your app inside pod before it enters into `Terminated` phase.
This is great way to shut down system you don't have control over and cannot adjust it to handle signals.


Regardless which method described above you choose, you have to make sure that it ends its execution before defined `terminationGracePeriodSeconds`.
Otherwise your pod will be killed

### Requirements

* Kubernetes cluster

### Requirements

A co z error code ?
A co się stanie jak będzie force kill ? 

### Further reading

1. [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)