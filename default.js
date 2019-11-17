var wsUri = 'ws://echo.websocket.org/';
var webSocket;
var timerId = 0;

$(function () {
    if (checkSupported()) {
        connect();
        $('#btnSend').click(doSend());
    }
});

function writeOutput(message) {
    var $output = $('#divOutput');
    $output.html(`${$output.html()}<br />${message}`);
}

function checkSupported() {
    if (window.WebSocket) {
        writeOutput('WebSockets supported!');
        return true;
    }
    else {
        writeOutput('WebSockets not supported!');
        $('#btnSend').attr('disabled', 'disabled');
        return false;
    }
}

function connect() {
    webSocket = new WebSocket(wsUri);
    webSocket.onopen = function (event) { onOpen(event) };
    webSocket.onclose = function (event) { onClose(event) };
    webSocket.onmessage = function (event) { onMessage(event) };
    webSocket.onerror = function (event) { onError(event) };
}

function onOpen(evt) {
    keepAlive();
    writeOutput("CONNECTED");
}

function onClose(evt) {
    cancelKeepAlive();
    writeOutput("DISCONNECTED");
}

function onMessage(evt) {
    writeOutput('RESPONSE: ' + evt.data);
}

function onError(evt) {
    writeOutput('ERROR: ' + evt.data);
}

function doSend() {
    // CONNECTING = 0 Connection is not yet open.
    // OPEN = 1 Connection is open and ready to communicate.
    // CLOSING = 2 Connection is in the process of closing.
    // CLOSED = 3 Connection is closed or couldn’t be opened.
    if (webSocket.readyState != webSocket.OPEN) {
        writeOutput("NOT OPEN: " + $('#txtMessage').val());
        return;
    }

    writeOutput("SENT: " + $('#txtMessage').val());
    webSocket.send($('#txtMessage').val())
}

function keepAlive() {
    var timeout = 15000;
    if (webSocket.readyState == webSocket.OPEN) {
        webSocket.send('');
    }
    timerId = setTimeout(keepAlive, timeout);
}

function cancelKeepAlive() {
    if (timerId) {
        cancelTimeout(timerId);
    } 
}