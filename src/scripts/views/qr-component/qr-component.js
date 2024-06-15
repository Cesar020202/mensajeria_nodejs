
document.addEventListener('DOMContentLoaded', () => {
    checkQRStatus()
});

document.getElementById('boton_iniciar').addEventListener('click', () => {
    startClient();
});

document.getElementById('boton_detener').addEventListener('click', () => {
    stopClient();
});

document.getElementById('boton_resetear').addEventListener('click', () => {
    resetClient();
});


let intervalId;

async function checkQRStatus() {
  try {
    const response = await fetch('/qr-status');
    const data = await response.json();
      const qrContainer = document.getElementById('qrContainer');
      const infoContainer = document.getElementById('infoContainer');

      if (data.clientReady) {
        qrContainer.style.display = 'none';
        infoContainer.style.display = 'block';
        infoContainer.innerHTML = `<p>Status: ready</p><p>Info: ${JSON.stringify(data.clientInfo)}</p>`;
        // clearInterval(intervalId); // Cancela el intervalo
      } else {
        qrContainer.style.display = 'block';
        infoContainer.style.display = 'none';
        qrContainer.innerHTML = `<img src="${data.qrCodeUrl}" alt="QR Code">`;
      }
  } catch (error) {
    console.error('Error fetching QR status:', error);
  };
};

// Iniciar cliente
async function startClient() {
  try {
    const response = await fetch('/start-client');
    const data = await response.json();
    console.log('Client started:', data);
  } catch (error) {
    console.error('Error starting client:', error);
  };
};

// Detener cliente
async function stopClient() {
  try {
    const response = await fetch('/stop-client');
    const data = await response.json();
    console.log('Client stopped:', data);
  } catch (error) {
    console.error('Error stopping client:', error);
  };
};

// Resetea cliente
async function resetClient() {
  try {
    const response = await fetch('/reset-client');
    const data = await response.json();
    console.log('Client reset:', data);
  } catch (error) {
    console.error('Error resetting client:', error);
  };
};

intervalId = setInterval(checkQRStatus, 10000); // Polling cada 10 segundos

// Toast
function showToast(tipo , mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: tipo === 'success' ? "green" : "red"
  }).showToast();
};
