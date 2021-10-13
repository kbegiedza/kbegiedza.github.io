---
layout: article
date: 2021-10-13 20:44:20 +0200
thumbnail: /assets/img/20211013/package-title-sm.png
title-image: /assets/img/20211013/package-title.png
title: How to publish your project as nuget package
description: Publishing your project as nuget package can seems difficult for new developers, but it's quite simple task.
categories: dotnet devops nuget
---

Publishing your project as nuget package can seems difficult for new developers, but it's really quite simple task. In this article I'll use my demo repo with simple progress bar for C#, which can be found [on GitHub](https://github.com/Ursanon/SharpBar) to guide you.

### Practicies

Let's start with few tips:
* Establish unique package id
* Use [symver](https://semver.org/) to version your package
* Include descriptive package summary

### Project configuration

Below you can find part of properly configured `.csproj` file.
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
  <!-- ... -->

  <TargetFramework>net5.0</TargetFramework>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>

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

  </PropertyGroup>
</Project>
```

To add icon for package you can utilize `<PackageIcon>` tag with image included inside `<ItemGroup>` tag.
NuGet gallery suggests icon with `128x128 px` resolution encoded as `.png` file with transparent background.
```xml
<ItemGroup>
    <None Include="../../docs/icon128.png" Pack="true" PackagePath="\"/>
</ItemGroup>
```

You can combine multiple values inside tags by using semicolon between tags, i.e.:
```xml
<TargetFrameworks>netstandard2.1;net461</TargetFrameworks>
```

### Publishing

Finally we can pack our package with `dotnet pack -c Release` and publish generated `.nupkg` file directly to NuGet repository.
You can upload package manually, use automated pipeline (ex. GitHub Actions) or do it with bash/powerShell script using [NuGet API keys](https://docs.microsoft.com/en-us/nuget/nuget-org/scoped-api-keys).

To publish with CLI you can execute following code:
```bash
dotnet nuget push <your-package>.nupkg --api-key <your-API-key> --source https://api.nuget.org/v3/index.json
```

### Further reading
Using this knowledge you can go deep and experiment with:
1. [Signing](https://docs.microsoft.com/en-us/nuget/create-packages/sign-a-package)
2. [NuGet API keys](https://docs.microsoft.com/en-us/nuget/nuget-org/scoped-api-keys)
3. [GitHub NugetPackages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-nuget-registry)
4. [Package prefix registration](https://docs.microsoft.com/en-us/nuget/nuget-org/id-prefix-reservation)