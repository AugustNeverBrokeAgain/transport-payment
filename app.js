const confirmButton = document.getElementById('confirmButton');
const transportSelection = document.getElementById('transportSelection');
const scanButton = document.getElementById('scanButton');
const reader = document.getElementById('reader');
const scanContainer = document.getElementById('scanContainer');
const loadingAnimation = document.getElementById('loadingAnimation');
const paymentAnimation = document.getElementById('paymentAnimation');
let html5QrCode; // Глобальная переменная для сканера

// Обработчик события для кнопки "Подтвердить"
confirmButton.addEventListener('click', () => {
  const transport = document.querySelector('input[name="transport"]:checked');
  const enteredNumber = document.getElementById('number').value.trim();

  // Проверяем, выбрано ли транспортное средство и введен ли номер
  if (!transport || enteredNumber === '') {
    alert('Пожалуйста, выберите транспорт и введите номер.');
    return;
  }

  // Скрываем выбор транспорта и показываем кнопку сканирования и картинку
  transportSelection.style.display = 'none';
  scanButton.style.display = 'inline';
  scanContainer.style.display = 'block'; // Показываем контейнер с картинкой
});

// Обработчик для кнопки "Сканировать QR-код"
scanButton.addEventListener("click", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Ваш браузер не поддерживает доступ к камере.");
    return;
  }

  // Запрашиваем доступ к камере
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

      // Отключаем кнопку сканирования на время
      scanButton.disabled = true;

      // Закрытие сканера через 10 секунд
      setTimeout(() => {
        stopScanning();
      }, 10000);
    })
    .catch(error => {
      alert("Ошибка при доступе к камере.");
    });
});

// Обработчик успешного сканирования QR-кода
const onScanSuccess = (decodedText, decodedResult) => {
  console.log("QR-код распознан:", decodedText);
  stopScanning();
};

// Обработчик ошибки сканирования QR-кода
const onScanFailure = error => {
  console.warn("Ошибка сканирования:", error);
};

// Функция для остановки сканирования и редиректа
function stopScanning() {
  html5QrCode.stop().then(() => {
    reader.style.display = 'none';
  }).catch(err => {
    console.error("Ошибка остановки сканера:", err);
  });

  // Показать анимацию загрузки
  loadingAnimation.classList.remove("hidden");

  // После 4 секунд показать успешную оплату и редирект на success.html
  setTimeout(() => {
    loadingAnimation.classList.add("hidden");
    paymentAnimation.classList.remove("hidden");

    // Перенаправляем пользователя на страницу успеха через 10 секунд
    window.location.href = "success.html"; // Редирект на success.html
  }, 4000);
};

window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");

  // Убираем прелоадер через 3 секунды
  setTimeout(() => {
    preloader.classList.add("hide");
  }, 3000); // исчезает через 3 секунды
});
