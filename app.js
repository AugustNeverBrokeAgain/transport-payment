const scanButton = document.getElementById("scanButton");
const reader = document.getElementById("reader");
const resultContainer = document.getElementById("result");
const qrContent = document.getElementById("qrContent");
const paymentAnimation = document.getElementById("paymentAnimation");
const loadingAnimation = document.getElementById("loadingAnimation"); // Новый элемент анимации
const scanContainer = document.getElementById("scanContainer"); // Контейнер с картинкой

let html5QrCode; // Глобальная переменная для сканера

const onScanSuccess = (decodedText, decodedResult) => {
  console.log("QR-код распознан:", decodedText);

  // Показать результат
  qrContent.textContent = decodedText;
  resultContainer.classList.remove("hidden");

  // Остановить сканирование
  html5QrCode.stop().then(() => {
    reader.classList.add("hidden");
    scanButton.disabled = false;
  }).catch(err => {
    console.error("Ошибка остановки сканера:", err);
  });

  // Скрыть контейнер с картинкой
  scanContainer.style.display = 'none';

  // Показать анимацию загрузки через 0.5 сек
  setTimeout(() => {
    loadingAnimation.classList.remove("hidden");

    // После 4 секунд скрыть анимацию загрузки и показать успешную оплату
    setTimeout(() => {
      loadingAnimation.classList.add("hidden");
      paymentAnimation.classList.remove("hidden");
    }, 4000);
  }, 500);
};

const onScanFailure = error => {
  // Ошибка сканирования, выводим в консоль
  console.warn("Ошибка сканирования:", error);
};

confirmButton.addEventListener('click', () => {
  const transport = document.querySelector('input[name="transport"]:checked');
  enteredNumber = document.getElementById('number').value.trim();

  if (!transport || enteredNumber === '') {
    alert('Пожалуйста, выберите транспорт и введите номер.');
    return;
  }

  selectedTransport = transport.value;
  transportSelection.style.display = 'none';
  scanButton.style.display = 'inline';

  // Показываем контейнер с картинкой
  scanContainer.style.display = 'block';
});

scanButton.addEventListener("click", () => {
  // Проверка поддержки камеры
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("Ваш браузер не поддерживает доступ к камере.");
    alert("Ваш браузер не поддерживает доступ к камере.");
    return;
  }

  // Запрос доступа к камере
  console.log("Запрос доступа к камере...");
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      // Если доступ разрешён — показываем камеру
      console.log("Доступ к камере получен!");

      // Останавливаем поток камеры сразу после получения разрешения
      stream.getTracks().forEach(track => track.stop());

      // Показываем область сканера
      reader.classList.remove("hidden");

      // Инициализируем и запускаем сканер
      html5QrCode = new Html5Qrcode("reader");

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanFailure
      ).catch(err => {
        console.error("Ошибка запуска сканера:", err);
        alert("Не удалось запустить сканирование. Возможно, камера занята другим приложением.");
      });

      scanButton.disabled = true; // Отключаем кнопку на время сканирования
    })
    .catch(error => {
      // Обработка ошибки, если доступ к камере отклонён
      console.error("Доступ к камере отклонён:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        alert("Вы не предоставили доступ к камере. Пожалуйста, разрешите доступ в настройках браузера.");
      } else {
        alert("Произошла ошибка при доступе к камере. Попробуйте обновить страницу.");
      }
    });
});
