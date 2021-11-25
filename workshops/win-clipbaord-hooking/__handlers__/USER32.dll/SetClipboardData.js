{
  /**
   * Called synchronously when about to call SetClipboardData.
   *
   * @this {object} - Object allowing you to store state for use in onLeave.
   * @param {function} log - Call this function with a string to be presented to the user.
   * @param {array} args - Function arguments represented as an array of NativePointer objects.
   * For example use args[0].readUtf8String() if the first argument is a pointer to a C string encoded as UTF-8.
   * It is also possible to modify arguments by assigning a NativePointer object to an element of this array.
   * @param {object} state - Object allowing you to keep state across function calls.
   * Only one JavaScript function will execute at a time, so do not worry about race-conditions.
   * However, do not use this to store function arguments across onEnter/onLeave, but instead
   * use "this" which is an object for keeping state local to an invocation.
   */
  onEnter(log, args, state) {
    log("[+] SetClipboardData() called");
    if (!args[1].isNull()) {
      var str = args[1].readPointer().readUtf16String();
      if (!str.startsWith("--"))
        log("[+] Captured Data: " + str);
      else
        log("[+] Clipboard was cleared")
    }
  },

  /**
   * Called synchronously when about to return from SetClipboardData.
   *
   * See onEnter for details.
   *
   * @this {object} - Object allowing you to access state stored in onEnter.
   * @param {function} log - Call this function with a string to be presented to the user.
   * @param {NativePointer} retval - Return value represented as a NativePointer object.
   * @param {object} state - Object allowing you to keep state across function calls.
   */
  onLeave(log, retval, state) {
    const openClipboardAddr = Module.findExportByName('User32.dll', 'OpenClipboard');
    const emptyClipboardAddr = Module.findExportByName('User32.dll', 'EmptyClipboard');
    const closeClipboardAddr = Module.findExportByName('User32.dll', 'CloseClipboard');

    const openClipboardCall = new NativeFunction(openClipboardAddr, 'int' /*BOOL*/, ['pointer' /*HWND*/]);
    const emptyClipboardCall = new NativeFunction(emptyClipboardAddr, 'int' /*BOOL*/, []);
    const closeClipboardCall = new NativeFunction(closeClipboardAddr, 'int' /*BOOL*/, []);
    
    /*log('[+] emptyClipboardCall() => ' + emptyClipboardCall);
    log('[+] openClipboardCall() => ' + openClipboardCall);
    log('[+] closeClipboardCall() => ' + closeClipboardCall);*/

    boolRet = openClipboardCall(ptr('0x0'));
    log('[+] openClipboard() => ' + boolRet);
    boolRet = emptyClipboardCall();
    log('[+] emptyClipboard() => ' + boolRet);
    boolRet = closeClipboardCall();
    log('[+] closeClipboard() => ' + boolRet);
  }
}