---
layout: article
date: 2021-10-06 20:44:20 +0200
thumbnail: /assets/img/placeholder0-sm.png
title-image: /assets/img/placeholder0.png
title: How to publish your project as nuget package
description: simply
categories: dotnet devops nuget
---

Publishing your project as nuget package can seems difficult for new developers, but it's really quite simple. In this article I'll use my demo repo with simple progress bar for C#, which can be found [on GitHub](https://github.com/Ursanon/SharpBar) to guide you.

### Practicies

Let's start with some good practices.

... practicies

### Project configuration

Then we can move on to configuring our `.csproj` file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
  <!-- standard properties -->

    <Product>SharpBar</Product>
    <Authors>Krzysztof Begiedza</Authors>
    <PackageLicenseExpression>MIT</PackageLicenseExpression>
    <Summary>Simple progress bar for your C# console app</Summary>
    <Copyright>Copyright © Krzysztof Begiedza 2021</Copyright>

    <Version>1.0.0</Version>
    <AssemblyVersion>1.0.0.0</AssemblyVersion>
    <FileVersion>1.0.0</FileVersion>
    <RepositoryUrl>https://github.com/Ursanon/SharpBar.git</RepositoryUrl>

    <PackageId>SharpBar</PackageId>
    <PackageIcon>icon128.png</PackageIcon>
    <PackageTags>cli;progress</PackageTags>
    <PackageProjectUrl>https://sharpbar.kbegiedza.eu</PackageProjectUrl>

    <PublishRepositoryUrl>true</PublishRepositoryUrl>
  </PropertyGroup>
</Project>
```

// fajnie dodać tutaj taki dislamer

Note:

You can combine multiple target framework by using semicolon between concrete targets, i.e:
```xml
<TargetFrameworks>netstandard2.1;net461</TargetFrameworks>
```

### Publishing

Finally we can pack our package with `dotnet pack -c Release` and publish generated `.nupkg` file directly to NuGet repository.
You can upload package manually, use automated pipeline (ex. GitHub Actions) or do it with bash/powerShell script using [NuGet API keys](https://docs.microsoft.com/en-us/nuget/nuget-org/scoped-api-keys).

### Further reading
Using this knowledge you can go deep and experiment with:
1. [Signing](https://docs.microsoft.com/en-us/nuget/create-packages/sign-a-package)
2. [NuGet API keys](https://docs.microsoft.com/en-us/nuget/nuget-org/scoped-api-keys)
3. [GitHub NugetPackages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-nuget-registry)