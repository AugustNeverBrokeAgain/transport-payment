const confirmButton = document.getElementById('confirmButton');
const transportSelection = document.getElementById('transportSelection');
const scanButton = document.getElementById('scanButton');
const reader = document.getElementById('reader');
const scanContainer = document.getElementById('scanContainer');
const loadingAnimation = document.getElementById('loadingAnimation');
const paymentAnimation = document.getElementById('paymentAnimation');

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
  // Скрываем картинку и кнопку
  scanContainer.style.display = 'none';
  scanButton.style.display = 'none';

  // Показываем анимацию загрузки
  loadingAnimation.classList.remove("hidden");

  // Через 2 секунды показываем успешную оплату
  setTimeout(() => {
    loadingAnimation.classList.add("hidden");
    paymentAnimation.classList.remove("hidden");
  }, 2000);
});

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
