let tasks = [
    { id: 1, text: "Trazer trabalho de Geografia", category: "mochila", completed: false },
    { id: 2, text: "Estudar 15 min para Matemática", category: "prova", completed: false },
    { id: 3, text: "Graxar rolamento do skate", category: "skate", completed: true }
  ];
  
  let points = 120;
  let currentFilter = 'todas';
  
  const taskListEl = document.getElementById('taskList');
  const newTaskInput = document.getElementById('newTaskInput');
  const categorySelect = document.getElementById('taskCategorySelect');
  const btnAddTask = document.getElementById('btnAddTask');
  const pointsDisplay = document.getElementById('pointsDisplay');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressText = document.getElementById('progressText');
  
  // Renderizar Tarefas e Barra de Progresso
  function renderTasks() {
    taskListEl.innerHTML = '';
  
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'todas') return true;
      return task.category === currentFilter;
    });
  
    if (filteredTasks.length === 0) {
      taskListEl.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 16px 0; font-size: 0.85rem;">Nenhuma tarefa por aqui! 😎</p>';
    } else {
      filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card categoria-${task.category} ${task.completed ? 'completed' : ''}`;
        
        card.innerHTML = `
          <div class="task-main-info">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-details">
              <strong>${task.text}</strong>
              <span>${task.category}</span>
            </div>
          </div>
          <button class="audio-speak-btn" onclick="speakText('${task.text}')" aria-label="Ouvir tarefa">
            <i class="ph-bold ph-speaker-high"></i>
          </button>
        `;
        
        taskListEl.appendChild(card);
      });
    }
  
    updateProgress();
  }
  
  // Atualizar Porcentagem do Dia
  function updateProgress() {
    if (tasks.length === 0) {
      progressBarFill.style.width = '0%';
      progressText.textContent = '0%';
      return;
    }
    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / tasks.length) * 100);
    progressBarFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
  }
  
  // Adicionar Nova Tarefa
  btnAddTask.addEventListener('click', () => {
    const text = newTaskInput.value.trim();
    if (text === '') return;
  
    const newTask = {
      id: Date.now(),
      text: text,
      category: categorySelect.value,
      completed: false
    };
  
    tasks.unshift(newTask);
    newTaskInput.value = '';
    renderTasks();
  });
  
  // Marcar/Desmarcar
  function toggleTask(id) {
    tasks = tasks.map(t => {
      if (t.id === id) {
        const updatedStatus = !t.completed;
        if (updatedStatus) {
          points += 10;
          pointsDisplay.textContent = `${points} pts`;
        }
        return { ...t, completed: updatedStatus };
      }
      return t;
    });
    renderTasks();
  }
  
  // Filtrar
  function filterTasks(category, btn) {
    currentFilter = category;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  }
  
  // Alternar Abas
  function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
  }
  
  // Text-to-Speech (Leitura de Voz)
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('A leitura de voz não é suportada neste navegador.');
    }
  }
  
  // Ditado por Voz (Microfone)
  const btnVoiceInput = document.getElementById('btnVoiceInput');
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
  
    btnVoiceInput.addEventListener('click', () => {
      recognition.start();
      btnVoiceInput.classList.add('listening');
    });
  
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      newTaskInput.value = speechToText;
      btnVoiceInput.classList.remove('listening');
    };
  
    recognition.onerror = () => {
      btnVoiceInput.classList.remove('listening');
    };
  } else {
    btnVoiceInput.style.display = 'none'; // Oculta se o navegador não suportar
  }
  
  // Modal de Mochila Rápida
  function openBackpackModal() {
    document.getElementById('backpackModal').style.display = 'flex';
  }
  function closeBackpackModal() {
    document.getElementById('backpackModal').style.display = 'none';
  }
  
  // Trocar Temas
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.className = '';
    if (theme === 'neon') document.body.classList.add('theme-neon');
    if (theme === 'contrast') document.body.classList.add('theme-contrast');
  });
  
  // Cronômetro / Modo Foco
  let timerSeconds = 15 * 60;
  let timerInterval = null;
  let isTimerRunning = false;
  
  const timerDisplay = document.getElementById('timerDisplay');
  const btnStartTimer = document.getElementById('btnStartTimer');
  const btnResetTimer = document.getElementById('btnResetTimer');
  const timerBtnText = document.getElementById('timerBtnText');
  const playIcon = document.getElementById('playIcon');
  
  function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  btnStartTimer.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerBtnText.textContent = 'Continuar';
      playIcon.className = 'ph-bold ph-play';
    } else {
      isTimerRunning = true;
      timerBtnText.textContent = 'Pausar';
      playIcon.className = 'ph-bold ph-pause';
      
      timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
          timerSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          speakText('Sessão de foco concluída! Parabéns!');
          points += 30;
          pointsDisplay.textContent = `${points} pts`;
          alert('Sessão concluída! Você ganhou +30 pontos!');
          btnResetTimer.click();
        }
      }, 1000);
    }
  });
  
  btnResetTimer.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 15 * 60;
    timerBtnText.textContent = 'Iniciar';
    playIcon.className = 'ph-bold ph-play';
    updateTimerDisplay();
  });
  
  // Inicializar
  renderTasks();