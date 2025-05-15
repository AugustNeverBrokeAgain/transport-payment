const confirmButton = document.getElementById('confirmButton');
const transportSelection = document.getElementById('transportSelection');
const scanButton = document.getElementById('scanButton');
const reader = document.getElementById('reader');
const scanContainer = document.getElementById('scanContainer');
const loadingAnimation = document.getElementById('loadingAnimation');
const paymentAnimation = document.getElementById('paymentAnimation');
let html5QrCode; // Глобальная переменная для сканера

confirmButton.addEventListener('click', () => {
  const transport = document.querySelector('input[name="transport"]:checked');
  const enteredNumber = document.getElementById('number').value.trim();

  if (!transport || enteredNumber === '') {
    alert('Пожалуйста, выберите транспорт и введите номер.');
    return;
  }

  transportSelection.style.display = 'none';
  scanButton.style.display = 'inline';
  scanContainer.style.display = 'block'; // Показываем контейнер с картинкой
});

scanButton.addEventListener("click", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Ваш браузер не поддерживает доступ к камере.");
    return;
  }

  // Запрос доступа к камере
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      // Останавливаем поток камеры сразу после получения разрешения
      stream.getTracks().forEach(track => track.stop());

      // Показываем область сканера
      reader.style.display = 'block';

      // Инициализируем и запускаем сканер
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

      scanButton.disabled = true; // Отключаем кнопку на время сканирования

      // Закрытие сканера через 10 секунд
      setTimeout(() => {
        stopScanning();
      }, 10000);
    })
    .catch(error => {
      alert("Ошибка при доступе к камере.");
    });
});

const onScanSuccess = (decodedText, decodedResult) => {
  console.log("QR-код распознан:", decodedText);
  stopScanning();
};

const onScanFailure = error => {
  console.warn("Ошибка сканирования:", error);
};

function stopScanning() {
  html5QrCode.stop().then(() => {
    reader.style.display = 'none';
  }).catch(err => {
    console.error("Ошибка остановки сканера:", err);
  });

  // Показать анимацию загрузки
  loadingAnimation.classList.remove("hidden");

  // Через 4 секунды показать успешную оплату
  setTimeout(() => {
    loadingAnimation.classList.add("hidden");
    paymentAnimation.classList.remove("hidden");
  }, 4000);
};

window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const loadingText = document.getElementById("loadingText");

  // Встроенный список фраз
  const phrases = [
  "Дрочим копейки...",
  "Обновляем балансы...",
  "Взламываем СБП, ахах",
  "Ищем ненаход...",
  "Ваши данные в пути...",
  "Для тех, кто Z-нулся",
  "Скоро всё загрузится..."
  ];

  // Случайная фраза
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  loadingText.textContent = randomPhrase;

  // Убираем прелоадер через 3 секунды
  setTimeout(() => {
    preloader.classList.add("hide");
  }, 3000);
});
