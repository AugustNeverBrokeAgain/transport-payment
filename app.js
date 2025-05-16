const confirmButton = document.getElementById('confirmButton');
const transportSelection = document.getElementById('transportSelection');
const scanButton = document.getElementById('scanButton');
const reader = document.getElementById('reader');
const scanContainer = document.getElementById('scanContainer');
const loadingAnimation = document.getElementById('loadingAnimation');
const paymentAnimation = document.getElementById('paymentAnimation');
let html5QrCode; // Глобальная переменная для сканера

// Кнопка подтверждения выбора транспорта и номера
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

// Кнопка запуска сканера
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

      // Остановка сканера и редирект через 10 секунд
      setTimeout(() => {
        stopScanning();
      }, 10000);
    })
    .catch(error => {
      alert("Ошибка при доступе к камере.");
    });
});

// Успешное сканирование
const onScanSuccess = (decodedText, decodedResult) => {
  console.log("QR-код распознан:", decodedText);
  stopScanning();
};

// Ошибка сканирования
const onScanFailure = error => {
  console.warn("Ошибка сканирования:", error);
};

// Завершение сканирования и редирект
function stopScanning() {
  html5QrCode.stop().then(() => {
    reader.style.display = 'none';
  }).catch(err => {
    console.error("Ошибка остановки сканера:", err);
  });

  scanContainer.style.display = 'none';
  scanButton.style.display = 'none';

  loadingAnimation.classList.remove("hidden");

  setTimeout(() => {
    loadingAnimation.classList.add("hidden");
    paymentAnimation.classList.remove("hidden");

    // Редирект на success.html
    window.location.href = "success.html";
  }, 4000);
}

// Прелоадер с фразами
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
  if (loadingText) {
    loadingText.textContent = randomPhrase;
  }

  setTimeout(() => {
    preloader.classList.add("hide");
  }, 3000);
});
