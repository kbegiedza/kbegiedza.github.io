---
layout: article
date: "2022-04-17"
thumbnail: /assets/img/placeholder/title-sm.png
title-image: /assets/img/placeholder/title.png
title: Setup CUDA development with vscode
description: Descriptions.
categories: CUDA devops C++
---

So you want to dive deep into CUDA and C++ world.
It can be nasty place with hard to understand environment configuration, but fear not there is glimpse of light here...

Imagine that you can pack every dependency into some kind of bag, open it basically everywhere and focus on coding instead of installing everything from scratch.
You can utilize docker and vscode to prepare your own portable development environment in minutes.

### Host requirements
* CUDA-enabled device
* [Docker](https://www.docker.com/)
* [VSCode](https://code.visualstudio.com/)
* [Remote containers VSCode Extension](https://code.visualstudio.com/docs/remote/containers)
* [Nvidia container toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

### Remote container setup

First of all, to develop CUDA-enabled application we need proper device with support of CUDA and [Nvidia container toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html).
After installing all requirements on our host computer we can create remote container configuration.

Right after new project initialization you should create `.devcontainer` directory in project root and fill it with `devcontainer.json` file.
`devcontainer.json` is used to pass our configuration to [remote containers extension](https://code.visualstudio.com/docs/remote/containers).

We're almost there, now you can fill `devcontainer.json` with:    
```jsonc
{
    "name": "C++",
    "image": "ghcr.io/harbourb/cuda/sdk-vscode:11.6.0",
    "runArgs": [
        // we want to work with CUDA, so we need gpu device inside container
        "--gpus=all",
        // add capacity and security-opt to enable debugging inside container
        "--cap-add=SYS_PTRACE",
        "--security-opt",
        "seccomp=unconfined"
    ],
    "extensions": [
        "ms-vscode.cpptools",
        "ms-vscode.cmake-tools",
        "ms-vscode.cpptools-themes",
        "vadimcn.vscode-lldb",
    ],
    "remoteUser": "vscode",
}
```

Once above configuration is ready you can jump into container by selecting `Reopen in container` option from command palette (`Ctrl + Shift + P`)    

{: .post-image}
![Reopen in container example](../../assets/img/20220417/reopen-in-container.png)    

After window reload you can test your setup by typing `nvidia-smi` into terminal, expect output to look like below:    

{: .post-image}
![nvidia-smi](../../assets/img/20220417/nvidia-smi.png)

When you are sure that container with CUDA is up and running you can start developing your project with for instance CMake.
You can add CUDA in multiple ways utilizing modern CMake, if your projects always requires CUDA use:    
```cmake
project(
    project-name
    LANGUAGES CUDA CXX)
```
or use code below if CUDA is optional:    
```cmake
enable_language(CUDA)
```

Now you can configure, build and run your project with CUDA on board.

### Further reading
Using this knowledge you can go deep and experiment with:
1. [CUDA CMake docs](https://cliutils.gitlab.io/modern-cmake/chapters/packages/CUDA.html)