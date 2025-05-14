const scanButton = document.getElementById("scanButton");
const reader = document.getElementById("reader");
const resultContainer = document.getElementById("result");
const qrContent = document.getElementById("qrContent");
const paymentAnimation = document.getElementById("paymentAnimation");

let html5QrCode; // Объявляем глобально для остановки позже, если потребуется

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

  // Показать анимацию через 0.5 сек
  setTimeout(() => {
    paymentAnimation.classList.remove("hidden");
  }, 500);
};

const onScanFailure = error => {
  // Можно не выводить каждую ошибку — они происходят постоянно при нераспознавании
  console.warn("Ошибка сканирования:", error);
};

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

      // Закрываем временный доступ к камере
      stream.getTracks().forEach(track => track.stop());

      // Показываем область сканера
      reader.classList.remove("hidden");

      html5QrCode = new Html5Qrcode("reader");

      // Запуск сканера QR-кодов
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
      // Если пользователь отклонил доступ или произошла ошибка
      console.error("Доступ к камере отклонён:", error);
      alert("Вы не предоставили доступ к камере. Сканирование невозможно.");
    });
});
