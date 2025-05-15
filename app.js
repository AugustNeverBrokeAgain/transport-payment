const confirmButton = document.getElementById('confirmButton');
const transportSelection = document.getElementById('transportSelection');
const scanButton = document.getElementById('scanButton');
const reader = document.getElementById('reader');
const scanContainer = document.getElementById('scanContainer');
const loadingAnimation = document.getElementById('loadingAnimation');
const paymentAnimation = document.getElementById('paymentAnimation');

let html5QrCode;
let scanCompleted = false;

confirmButton.addEventListener('click', () => {
  const transport = document.querySelector('input[name="transport"]:checked');
  const enteredNumber = document.getElementById('number').value.trim();

  if (!transport || enteredNumber === '') {
    alert('Пожалуйста, выберите транспорт и введите номер.');
    return;
  }

  transportSelection.style.display = 'none';
  scanButton.style.display = 'inline';
  scanContainer.style.display = 'block';
});

scanButton.addEventListener("click", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Ваш браузер не поддерживает доступ к камере.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      stream.getTracks().forEach(track => track.stop());

      reader.style.display = 'block';

      html5QrCode = new Html5Qrcode("reader");

      scanCompleted = false;

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanFailure
      ).catch(err => {
        console.error("Ошибка запуска сканера:", err);
        alert("Не удалось запустить сканирование.");
      });

      scanButton.disabled = true;

      // Таймер: если не распознано — всё равно закрываем
      setTimeout(() => {
        if (!scanCompleted) {
          scanCompleted = true;
          console.warn("Время ожидания сканирования истекло");
          stopScanning();
        }
      }, 10000);
    })
    .catch(error => {
      alert("Ошибка при доступе к камере.");
    });
});

const onScanSuccess = (decodedText, decodedResult) => {
  if (scanCompleted) return;
  scanCompleted = true;

  console.log("QR-код распознан:", decodedText);
  stopScanning();
};

const onScanFailure = error => {
  // Можно логировать, но не трогать дальше
  console.warn("Ошибка сканирования:", error);
};

function stopScanning() {
  html5QrCode.stop().then(() => {
    reader.style.display = 'none';
  }).catch(err => {
    console.error("Ошибка остановки сканера:", err);
  });

  loadingAnimation.classList.remove("hidden");

  setTimeout(() => {
    loadingAnimation.classList.add("hidden");
    paymentAnimation.classList.remove("hidden");
  }, 4000);
}

// Прелоадер и случайные фразы
window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const loadingText = document.getElementById("loadingText");

  const phrases = [
    "Дрочим копейки...",
    "Обновляем балансы...",
    "Взламываем СБП, ахах",
    "Ищем ненаход...",
    "Ваши данные в пути...",
    "Для тех, кто Z-нулся",
    "Скоро всё загрузится..."
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  loadingText.textContent = randomPhrase;

  setTimeout(() => {
    preloader.classList.add("hide");
  }, 3000);
});
