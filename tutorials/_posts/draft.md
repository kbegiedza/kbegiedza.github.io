---
layout: article
date: "2022-07-07"
thumbnail: /assets/img/placeholder/title-sm.png
title-image: /assets/img/placeholder/title.png
title:
description:
categories:
---

### Abstract


### Requirements

1. Create resource
2. Register for `Microsoft.AzureActiveDirectory` ( via **Resource providers**)
3. Azure Active Directory -> Manage tenants -> Create B2C Tenant 
4. Register an application
5. Add identity providers
6. Create a user flow

```c#
public class AzureB2CApplicationSettings
{
  public Guid TenantId { get; set; }

  public Guid ClientId { get; set; }

  public string Domain { get; set; } = string.Empty;

  public string Policy { get; set; } = string.Empty;

  public string Instance { get; set; } = string.Empty;

  public string Authority => $"https://{Instance}/{Domain}/{Policy}/v2.0/";
}
```

```json
{
    "AzureB2CApplicationSettings": {
        "Policy": "B2C_1_SSO",
        "Instance": "example.b2clogin.com",
        "Domain": "example.onmicrosoft.com",
        "TenantId": "87298644-c92e-4583-aeab-a0a100884818",
        "ClientId": "52cd6ba4-5d8e-4f1b-9a6d-fb5facb6e69a"
    },
}
```

### 



### Further reading

