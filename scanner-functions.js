NIMMSTA.websocketPort = 64693;
NIMMSTA.requestSendTimeout = 1000; // 1000 ms until a request is considered 'failed'
NIMMSTA.maxCommunicationRetries = 3; // Roughly 3 * 1000 ms = 3000 ms is the time until onError will be invoked if app is missing.

var device;

// Invoked once connection to app is ready to be used.
NIMMSTA.onReady(function() {
    const connectionManager = new NimmstaConnectionManager();
    if (connectionManager.devices.length > 0) {
        device = connectionManager.devices[0];
        console.log(device);
        document.getElementById('address').innerHTML = device.address
        document.getElementById('trigger-mode').innerHTML = device.preferredTriggerMode
        device.getDeviceInfo().then((response) => {
            console.log(response)
            document.getElementById('bat-value').innerHTML = response.batteryLevel + '%'
            if(device.isCharging) document.getElementById('bat-value').innerHTML += ' (lädt)'
        });
        // register events
        device.scanEvent.subscribe((event) => {
            console.log("Scanned barcode:", event.barcode);
            console.log("Barcode Bytes:", event.barcodeBytes);
            document.getElementById('last-scan').value = event.barcode;
            // original (scanned) barcode without rules applied
            console.log("Scanned barcode without rules:", event.originalBarcode);
        });
        device.touchEvent.subscribe((event) => {
            console.log(`TouchEvent: X: ${event.x} Y: ${event.y}`);
            showTouch(event.x, event.y);
        });
        device.batteryLevelChangedEvent.subscribe((event) => {
            console.log(`Battery level changed to ${event.batteryLevel}`);
            document.getElementById('bat-value').innerHTML = event.batteryLevel + '%'
        });
        connectionManager.socketDisconnectEvent.subscribe((event) => {
            console.log("CurrentConnectionCount", event.currentConnectionCount);
            $('alert-disconnect').show();
        });
    } else {
        connectionManager.displayConnectActivity();
    }
});

NIMMSTA.onError(function(error) {
    // handle error, e.g. app is not installed, so no connection was established.
    // Retry connect by calling NIMMSTA.tryConnect()
    console.error(error);
    alert(error);
});

writeToWatch = () => {
    device.setLayoutFor(5000, new SuccessLayout(document.getElementById('text-input').value)).then(() => {
        console.log('Text gesetzt');
        document.getElementById('text-input').classList.add('is-valid');
    }).catch((error) => {
        console.log(error);
        document.getElementById('text-input').classList.add('is-invalid');
    });
}

clearValInput = (input) => {
    if(input.classList.contains('is-valid')) input.classList.remove('is-valid')
    if(input.classList.contains('is-valid')) input.classList.remove('is-invalid')
}

colorLED =() => {
    device.setLEDColor(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)).then(() => {
        console.log("Led color successfully set");
    }).catch((error) => {
        console.log("Error setting LED color", error);
    });
}
LEDoff =() => {
    device.setLEDColor(0,0,0).then(() => {
        console.log("Led color successfully set to 0 0 0 ");
    }).catch((error) => {
        console.log("Error setting LED color", error);
    });
}

setExampleLayout = () => {
    const xml = `
<?xml version="1.0" encoding="utf-8"?>
<NimmstaLayout name="empty">
    <device width="1.54" height="1.54" pxx="200" pxy="200">
        <screen default="true" name="default">
            <staticElements>
            <statusbar />
            <cell x="3" horizontalAlignment="center" fontSize="17pt" name="heading">HEADING</cell>
            <horizontalLine y="50"></horizontalLine>
            <cell x="3" horizontalAlignment="center" fontSize="26pt" wrapMode="wrap" maxLines="0" name="text">SOME TEXT WITH WORD WRAP</cell>
            </staticElements>
        </screen>
    </device>
</NimmstaLayout>
`;
device.setXMLLayoutFor(10000, xml).then(() => {
    console.log("XML layout with timeout successfully set");
}).catch((error) => {
    console.log("Error setting XML layout with timeout", error);
});
}

showTouch = (x, y) => {
    lastTouch = document.getElementById('last-touch');
    lastTouch.style.left = x + document.getElementById('display').offsetLeft + 'px'
    lastTouch.style.top = y + document.getElementById('display').offsetTop + 'px'
}