// Правильные ответы для каждого эпизода
const correctAnswers = {
  1: 'A', // Sony DCR-TRV900
  2: 'B', // Canon XL1
  3: 'C', // Panasonic AG-DVX100
  4: 'A'  // GoPro Hero3
};

// Следующая страница для каждого эпизода
const nextPages = {
  1: 'episode2.html',
  2: 'episode3.html',
  3: 'episode4.html',
  4: 'certificate.html'
};

// Функция проверки ответа
function checkAnswer(selectedAnswer, episodeNumber) {
  const feedbackDiv = document.getElementById('feedback');
  const buttons = document.querySelectorAll('.answer-btn');
  const correct = correctAnswers[episodeNumber];

  // Отключаем все кнопки
  buttons.forEach(btn => btn.disabled = true);

  // Подсвечиваем правильный и неправильный ответы
  buttons.forEach(btn => {
    const answer = btn.getAttribute('data-answer');
    if (answer === correct) {
      btn.classList.add('correct');
    }
    if (answer === selectedAnswer && answer !== correct) {
      btn.classList.add('incorrect');
    }
  });

  // Показываем feedback
  if (selectedAnswer === correct) {
    feedbackDiv.className = 'feedback success';
    feedbackDiv.innerHTML = `
      <h3>✅ Правильно!</h3>
      <p>Отличная работа! Вы правильно определили камеру.</p>
      <button class="btn-next" onclick="goToNextPage(${episodeNumber})">
        ${episodeNumber === 4 ? 'Получить сертификат 🏆' : 'Следующий эпизод →'}
      </button>
    `;

    // Сохраняем прогресс
    saveProgress(episodeNumber, true);
  } else {
    feedbackDiv.className = 'feedback error';
    feedbackDiv.innerHTML = `
      <h3>❌ Неправильно</h3>
      <p>Попробуйте ещё раз! Обратите внимание на визуальные характеристики камеры.</p>
      <button class="btn-next" onclick="resetQuestion()">Попробовать снова</button>
      <a href="cameras.html" class="btn-cameras" target="_blank" style="display: inline-block; margin-top: 10px;">
        📷 Открыть справочник камер
      </a>
    `;

    // Сохраняем прогресс с ошибкой
    saveProgress(episodeNumber, false);
  }
}

// Функция перехода к следующей странице
function goToNextPage(episodeNumber) {
  const nextPage = nextPages[episodeNumber];
  window.location.href = nextPage;
}

// Функция сброса вопроса
function resetQuestion() {
  const feedbackDiv = document.getElementById('feedback');
  const buttons = document.querySelectorAll('.answer-btn');

  // Очищаем feedback
  feedbackDiv.className = 'feedback';
  feedbackDiv.innerHTML = '';

  // Включаем все кнопки и убираем классы
  buttons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
}

// Функция сохранения прогресса
function saveProgress(episodeNumber, isCorrect) {
  // Получаем текущий прогресс
  let completedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
  let correctAnswersCount = parseInt(localStorage.getItem('correctAnswers') || '0');

  // Добавляем эпизод в список завершенных
  if (!completedEpisodes.includes(episodeNumber)) {
    completedEpisodes.push(episodeNumber);
    localStorage.setItem('completedEpisodes', JSON.stringify(completedEpisodes));
    localStorage.setItem('episodesCompleted', completedEpisodes.length.toString());
  }

  // Увеличиваем счетчик правильных ответов
  if (isCorrect) {
    const episodeKey = `episode${episodeNumber}_correct`;
    if (!localStorage.getItem(episodeKey)) {
      correctAnswersCount++;
      localStorage.setItem('correctAnswers', correctAnswersCount.toString());
      localStorage.setItem(episodeKey, 'true');
    }
  }
}

// Функция получения прогресса
function getProgress() {
  const completedEpisodes = JSON.parse(localStorage.getItem('completedEpisodes') || '[]');
  const correctAnswers = parseInt(localStorage.getItem('correctAnswers') || '0');

  return {
    completedEpisodes,
    correctAnswers,
    totalEpisodes: 4
  };
}

// Функция сброса прогресса
function resetProgress() {
  localStorage.removeItem('completedEpisodes');
  localStorage.removeItem('correctAnswers');
  localStorage.removeItem('userName');
  for (let i = 1; i <= 4; i++) {
    localStorage.removeItem(`episode${i}_correct`);
  }
}

// Функция установки имени пользователя
function setUserName() {
  const name = prompt('Введите ваше имя для сертификата:');
  if (name && name.trim()) {
    localStorage.setItem('userName', name.trim());
    alert(`Имя сохранено: ${name.trim()}`);
  }
}

// Показать прогресс в консоли (для отладки)
console.log('AFilm Game - Current Progress:', getProgress());
