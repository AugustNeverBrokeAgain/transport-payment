const scanButton = document.getElementById("scanButton");
const resultContainer = document.getElementById("result");
const qrContent = document.getElementById("qrContent");
const paymentAnimation = document.getElementById("paymentAnimation");

const onScanSuccess = (decodedText, decodedResult) => {
  // Показать информацию с QR
  qrContent.textContent = decodedText;
  
  // Показать контейнер с результатом
  resultContainer.classList.remove("hidden");

  // Показать анимацию
  setTimeout(() => {
    paymentAnimation.classList.remove("hidden");
  }, 500);
};

const onScanError = (errorMessage) => {
  console.warn(errorMessage);
};

scanButton.addEventListener("click", () => {
  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" }, // Камера
    {
      fps: 10,    // Частота кадров
      qrbox: 250  // Размер области для сканирования
    },
    onScanSuccess,
    onScanError
  );
  scanButton.disabled = true;  // Отключить кнопку после нажатия
});
