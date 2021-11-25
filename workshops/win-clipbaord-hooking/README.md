# Simulating malware using Frida

## Introduction
What is function hooking? It is a procedure that allows you to get notified when a function has been called and/or is about to return. At that point you have the option to read the parameters, change variables, return a different value, etc. While having access to the code helps, you can hook OS calls even if you only have the compiled binary.

What is [frida](https://frida.re)? It is a dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers. We will use it to inject JavaScript into a native apps on Linux (curl) to allow us to explore it superficially but it can be used for [a **lot** more](https://www.youtube.com/watch?v=QC2jQI7GLus)!

## Clipper malware
* [The Malware That Swaps Your Address And Drains Your Wallet](https://medium.com/immunefi/the-malware-that-swaps-your-address-and-drains-your-wallet-552915fba542)
* [Python implementation](https://github.com/NightfallGT/BTC-Clipper)

## Files in this directory
### Handlers
All the JS files are under ```/__handlers__``` directory. Since we will be using only functions from libpthread library, all the handlers are under ```/__handlers__/USER32.dll```. Frida uses one JS handler for each function, this exercise uses a total of 2. Each handler has 2 JS functions in it:

- onEnter(): triggered as soon as the hooked function is called. This allows you to know the sequence in which functions are called, the value of the parameters, etc.
- onLeave(): triggered just before the hooked function returns. This allows you to check/change the return value, read buffers that were modified by the function, etc.

### Running the scenarios
Use the provided ```notapad.bat```.

## Functions reference
- [HANDLE GetClipboardData([in] UINT uFormat);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclipboarddata)
- [HANDLE SetClipboardData([in] UINT uFormat, [in, optional] HANDLE hMem);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setclipboarddata)
- [BOOL OpenClipboard([in, optional] HWND hWndNewOwner);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-openclipboard)
- [BOOL EmptyClipboard();](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-emptyclipboard)
- [BOOL CloseClipboard();](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-closeclipboard)
- [Windows app development documentation: Using the Clipboard](https://docs.microsoft.com/en-us/windows/win32/dataxchg/using-the-clipboard)