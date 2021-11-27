# Simulating Clipper malware using Frida

## Introduction
What is function hooking? What is [frida](https://frida.re)? Refer to the [Introduction of the first workshop](../lnx-hooking/README.md).

## Clipper malware
[Clipper](https://medium.com/immunefi/the-malware-that-swaps-your-address-and-drains-your-wallet-552915fba542) is malware that swaps cryptocurrency wallet addresses in the clipboard, in order to divert payments to an adress owned by the malware authors. MalwareBytes Labs [analysed Trojan.Clipper](https://blog.malwarebytes.com/detections/trojan-clipper/) and there are many implementations be security reserchers, including [this one in Python](https://github.com/NightfallGT/BTC-Clipper).

In this workshop we will replicate this behaviour using Frida and Notepad. It is a simple implementation that monitors clipboard pastes for [Pay-To-Script Hash](https://en.bitcoinwiki.org/wiki/Pay-to-Script_Hash) (P2SH) addresses which look like this: ```3N5i3Vs9UMyjYbBCFNQqU3ybSuDepX7oT3```. When a P2SH address is about to be pasted, we will replace the contents of the clipboard by a fake address.

## Files in this directory
### Handlers
All the handlers are under ```/__handlers__/USER32.dll```, where two functions will be hooked:

- ```GetClipboardData()```: is called by a program to read the contents of the clipboard, e.g. when the user pressed [Ctrl+V]. As soon as ```onLeave``` is triggered, the hook will check that the format of the clipboard content is ```CF_UNICODETEXT``` and that the text is a valid P2SH address. At this point the hook will replace the string content, which results in the fake address being pasted. The hook will not modify any other pasted string.
- ```SetClipboardData()```: is called by a program to write contents to the clipboard, e.g. when the user pressed [Ctrl+C] or [Ctrl+X]. Hooking it was not needed for this experiment, however it will be a way to demonstrate the potential of function hooking. As soon as ```onLeave``` is triggered, the hook will call ```OpenClipboard()```, ```EmptyClipboard()``` and ```CloseClipboard()``` in that order. This has the effect of undoing the Copy/Cut operation that just happened.

### Options
The files named ```notepad.opt``` extension are the frida-trace command line options for our scenarios.

### Running the scenario
Use the provided ```notapad.bat```.

## Functions reference
- [HANDLE GetClipboardData([in] UINT uFormat);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclipboarddata)
- [HANDLE SetClipboardData([in] UINT uFormat, [in, optional] HANDLE hMem);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setclipboarddata)
- [BOOL OpenClipboard([in, optional] HWND hWndNewOwner);](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-openclipboard)
- [BOOL EmptyClipboard();](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-emptyclipboard)
- [BOOL CloseClipboard();](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-closeclipboard)
- [Windows app development documentation: Using the Clipboard](https://docs.microsoft.com/en-us/windows/win32/dataxchg/using-the-clipboard)
- [Windows app development documentation: Clipboard Formats](https://docs.microsoft.com/en-us/windows/win32/dataxchg/clipboard-formats)