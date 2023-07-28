NIMMSTA.websocketPort = 64693;
NIMMSTA.requestSendTimeout = 1000; // 1000 ms until a request is considered 'failed'
NIMMSTA.maxCommunicationRetries = 3; // Roughly 3 * 1000 ms = 3000 ms is the time until onError will be invoked if app is missing.

var device;

// Invoked once connection to app is ready to be used.
NIMMSTA.onReady(function() {
    const connectionManager = new NimmstaConnectionManager();
    if (connectionManager.devices.length > 0) {
        device = connectionManager.devices[0];
        console.log(device)
        document.getElementById('address').innerHTML = device.address
        document.getElementById('bat-value').innerHTML = device.batteryLevel
        if(device.isCharging) document.getElementById('bat-value').innerHTML += '(lädt)'
        document.getElementById('trigger-mode').innerHTML = device.preferredTriggerMode
    } else {
        connectionManager.displayConnectActivity();
    }
});

NIMMSTA.onError(function(error) {
    // handle error, e.g. app is not installed, so no connection was established.
    // Retry connect by calling NIMMSTA.tryConnect()
    console.error(error)
    alert(error)
});

writeToWatch = (text) => {
    device.setLayout(new SuccessLayout(text)).then(() => {
        console.log('Text gesetzt')
        document.getElementById('text-input').classList.add('is-valid')
    }).catch((error) => {
        console.log(error)
        document.getElementById('text-input').classList.add('is-invalid')
    });
}

colorLED = () => {
    device.setLEDColor(100, 0, 200).then(() => {
        console.log("Led color successfully set");
    }).catch((error) => {
        console.log("Error setting LED color", error);
    });
}