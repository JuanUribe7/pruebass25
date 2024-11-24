function sendCommand(command) {
    fetch(`/../Back-end/server/send-command/${command}`)
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
  }
  // Hacer la función globalmente accesible
window.sendCommand = sendCommand;