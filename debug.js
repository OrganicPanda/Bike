(function() {
  // saving the original console.log function
  var preservedConsoleLog = console.log
    , debugElement
    , firstCall = true
    , count = 0
    , max = 5
    , passthrough = true
    , logText
    , logElement;

  //overriding console.log function
  console = console || {};
  console.log = function() {
    if (firstCall) {
      debugElement = document.querySelector('#debug');
      firstCall = false;
    }

    if (debugElement) {
      try {
        logText = JSON.stringify(Array.prototype.slice.call(arguments, 0));
      } catch (e) {
        logText = 'Can\'t stringify ' + e;
      }
      logElement = document.createElement('pre');
      logElement.innerHTML = logText;
      debugElement.appendChild(logElement);
      count++;

      if (count > max) {
        debugElement.removeChild(debugElement.firstChild);
      }
    }

    if (passthrough) {
      preservedConsoleLog.apply(console, arguments);
    }
  }
})();