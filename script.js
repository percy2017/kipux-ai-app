document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    //  1. ELEMENTOS DEL DOM Y ESTADO GLOBAL
    // =================================================================================

    // --- Elementos principales
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatHistory = document.getElementById('chat-history');
    const chatArea = document.getElementById('chat-area');
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    
    // --- Formulario de Input Avanzado
    const userInput = document.getElementById('user-input');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadMenu = document.getElementById('upload-menu');
    const fileInput = document.getElementById('file-input');
    const webSearchBtn = document.getElementById('web-search-btn');
    
    // --- Selector de Modelos
    const modelSelectorBtn = document.getElementById('model-selector-btn');
    const modelPopover = document.getElementById('model-popover');
    
    // --- Modal de Configuración
    const settingsModal = document.getElementById('settingsModal');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('apiKey');
    const themeSelector = document.getElementById('theme-selector');
    const notificationsSwitch = document.getElementById('notifications-switch');
    const defaultModelSelect = document.getElementById('default-model-select');

    // --- Estado Global
    const LITELLM_API_URL = 'https://litellm.percyalvarez.com/chat/completions';
    let conversations = {};
    let currentChatId = null;
    let availableModels = [];
    let appSettings = {};
    let isWebSearchEnabled = false;
    let thinkingAbortController = null;

    // =================================================================================
    //  2. FUNCIONES DE INICIALIZACIÓN Y CONFIGURACIÓN
    // =================================================================================

    const initialize = () => {
        loadSettings();
        applyTheme();
        loadConversations();
        renderChatHistory();
        fetchAndRenderModels();
        setupEventListeners();
        chatArea.classList.remove('chat-started'); 
    };

    const loadSettings = () => {
        const savedSettings = localStorage.getItem('kipux_ai_settings');
        appSettings = savedSettings ? JSON.parse(savedSettings) : {
            apiKey: '', theme: 'system', notifications: true, defaultModel: 'gpt-4o-mini'
        };
    };

    const saveSettings = () => {
        const selectedThemeInput = themeSelector.querySelector('input[name="theme"]:checked');
        appSettings = {
            apiKey: apiKeyInput.value.trim(),
            theme: selectedThemeInput ? selectedThemeInput.value : 'system',
            notifications: notificationsSwitch.checked,
            defaultModel: defaultModelSelect.value,
        };
        localStorage.setItem('kipux_ai_settings', JSON.stringify(appSettings));
        alert('Configuración guardada!');
        applyTheme();
        fetchAndRenderModels();
        bootstrap.Modal.getInstance(settingsModal).hide();
    };

    const applyTheme = () => {
        const theme = appSettings.theme;
        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-bs-theme', systemPrefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    };

    // =================================================================================
    //  3. GESTIÓN DE CONVERSACIONES (INCLUYE REGENERAR)
    // =================================================================================

    const loadConversations = () => {
        const savedChats = localStorage.getItem('kipux_ai_chats');
        if (savedChats) conversations = JSON.parse(savedChats);
    };

    const saveConversations = () => localStorage.setItem('kipux_ai_chats', JSON.stringify(conversations));
    
    const startNewChat = () => {
        if (thinkingAbortController) thinkingAbortController.abort();
        currentChatId = `chat_${Date.now()}`;
        conversations[currentChatId] = { title: 'Nuevo Chat', messages: [] };
        displayConversation(currentChatId);
    };

    const displayConversation = (chatId) => {
        currentChatId = chatId;
        chatBox.innerHTML = '';
        if (conversations[chatId]) {
            conversations[chatId].messages.forEach((msg, index) => {
                addMessageToUI(msg.role, msg.content, index);
            });
        }
        chatArea.classList.add('chat-started');
        renderChatHistory();
        userInput.focus();
    };

    const regenerateLastResponse = (messageIndex) => {
        if (!currentChatId || thinkingAbortController) return;

        // Eliminar la última respuesta del bot del historial de mensajes
        conversations[currentChatId].messages.splice(messageIndex);

        // Volver a renderizar la conversación sin la última respuesta
        displayConversation(currentChatId);

        // Reenviar la última pregunta del usuario
        handleFormSubmit(); 
    };

    // =================================================================================
    //  4. MANIPULACIÓN DE LA UI (INCLUYE BARRA DE ACCIONES Y HIGHLIGHT.JS)
    // =================================================================================
    
    const renderChatHistory = () => {
        chatHistory.innerHTML = '';
        Object.keys(conversations).sort().reverse().forEach(chatId => {
            const chat = conversations[chatId];
            if (chat.messages.length > 0) {
                const li = document.createElement('li');
                li.classList.add('nav-item', 'mb-1');
                li.innerHTML = `<a href="#" class="nav-link" data-chat-id="${chatId}">${chat.title}</a>`;
                chatHistory.appendChild(li);
            }
        });
        const activeLink = chatHistory.querySelector(`.nav-link[data-chat-id="${currentChatId}"]`);
        if (activeLink) activeLink.classList.add('active');
    };

    const addMessageToUI = (sender, text, messageIndex) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('message-wrapper', sender);
        wrapper.dataset.index = messageIndex;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        let formattedHtml = '';
        const parts = text.split(/(```[\s\S]*?```)/g);
        parts.forEach(part => {
            if (part.startsWith('```')) {
                const langMatch = part.match(/^```(\w*)\n/);
                const lang = langMatch && langMatch[1] ? langMatch[1] : 'plaintext';
                const code = part.substring((langMatch ? langMatch[0].length : 3), part.length - 3).trim();
                const safeCode = code.replace(/</g, "<").replace(/>/g, ">");
                formattedHtml += `<div class="code-block"><div class="code-header"><span>${lang}</span><button class="copy-code-btn-inner"><i class="bi bi-clipboard"></i></button></div><pre><code class="language-${lang}">${safeCode}</code></pre></div>`;
            } else {
                formattedHtml += part.replace(/\n/g, '<br>');
            }
        });
        messageDiv.innerHTML = formattedHtml;
        messageContent.appendChild(messageDiv);
        wrapper.appendChild(messageContent);
        
        if (sender === 'assistant') {
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="action-btn" data-action="copy" title="Copiar"><i class="bi bi-clipboard"></i></button>
                <button class="action-btn" data-action="speak" title="Leer en voz alta"><i class="bi bi-volume-up"></i></button>
                <button class="action-btn" data-action="regenerate" title="Regenerar"><i class="bi bi-arrow-clockwise"></i></button>
            `;
            wrapper.appendChild(actions);
        }

        chatBox.appendChild(wrapper);
        messageDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // =================================================================================
    //  5. LÓGICA DE API Y MODELOS
    // =================================================================================

    const fetchAndRenderModels = async () => {
        // ... (sin cambios, esta función ya es robusta)
        modelSelectorBtn.textContent = appSettings.defaultModel || 'Seleccionar Modelo';
        if (!appSettings.apiKey) {
            modelSelectorBtn.textContent = 'Ingrese API Key';
            return;
        }
        try {
            const headers = { 'Authorization': `Bearer ${appSettings.apiKey}` };
            const response = await fetch('https://litellm.percyalvarez.com/models', { headers });
            if (!response.ok) throw new Error('API Key inválida o sin permisos.');
            const data = await response.json();
            availableModels = data.data;
            const modelDescriptions = { 'gpt-4o-mini': 'Rápido e inteligente.', 'gpt-4o': 'El modelo más potente.', 'gemini/gemini-1.5-pro-latest': 'Gran ventana de contexto.', 'coder-large': 'Especializado en código.' };
            modelPopover.innerHTML = '';
            availableModels.forEach(model => {
                const item = document.createElement('div');
                item.className = `model-item ${model.id === appSettings.defaultModel ? 'active' : ''}`;
                item.dataset.modelId = model.id;
                item.innerHTML = `<div class="model-title">${model.id}</div><div class="model-desc">${modelDescriptions[model.id] || 'Modelo disponible.'}</div>`;
                modelPopover.appendChild(item);
            });
            defaultModelSelect.innerHTML = availableModels.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
            defaultModelSelect.value = appSettings.defaultModel;
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            modelSelectorBtn.textContent = 'Error de API Key';
        }
    };
    
    const handleFormSubmit = async (isRegeneration = false) => {
        if (!isRegeneration) {
            const messageText = userInput.value.trim();
            if (!messageText) return;
            if (!currentChatId) {
                startNewChat();
                // Esperar un momento para que el estado se actualice
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            if (conversations[currentChatId].messages.length === 0) {
                conversations[currentChatId].title = messageText.substring(0, 30);
            }
            let prompt = messageText;
            if (isWebSearchEnabled) {
                prompt = `[Búsqueda web activada] ${messageText}`;
                isWebSearchEnabled = false;
                webSearchBtn.classList.remove('active');
            }
            addMessageToUI('user', prompt, conversations[currentChatId].messages.length);
            conversations[currentChatId].messages.push({ role: 'user', content: prompt });
            userInput.value = '';
        }
        
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'message-wrapper bot';
        thinkingMessage.innerHTML = '<div class="message bot thinking">Kipux está pensando...</div>';
        chatBox.appendChild(thinkingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            if (!appSettings.apiKey) throw new Error("Por favor, ingresa una API Key en la configuración.");
            thinkingAbortController = new AbortController();
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${appSettings.apiKey}` };
            const response = await fetch(LITELLM_API_URL, {
                method: 'POST', headers, signal: thinkingAbortController.signal,
                body: JSON.stringify({ model: appSettings.defaultModel, messages: conversations[currentChatId].messages })
            });
            if (!response.ok) throw new Error(`Error de API: ${response.statusText} (${response.status})`);
            const data = await response.json();
            const botReply = data.choices[0].message.content;
            chatBox.removeChild(thinkingMessage);
            const botMessageIndex = conversations[currentChatId].messages.length;
            addMessageToUI('assistant', botReply, botMessageIndex);
            conversations[currentChatId].messages.push({ role: 'assistant', content: botReply });
            // Guardar solo si no es un chat temporal (lógica futura)
            saveConversations();
            renderChatHistory();
        } catch (error) {
            if (error.name === 'AbortError') console.log('Fetch abortado.');
            else {
                console.error(error);
                chatBox.removeChild(thinkingMessage);
                addMessageToUI('assistant', `Lo siento, ocurrió un error: ${error.message}`, -1);
            }
        } finally {
            thinkingAbortController = null;
        }
    };

    // =================================================================================
    //  6. EVENT LISTENERS
    // =================================================================================

    function setupEventListeners() {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('hidden'));
        newChatBtn.addEventListener('click', startNewChat);
        chatForm.addEventListener('submit', (e) => { e.preventDefault(); handleFormSubmit(); });
        
        chatHistory.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                if (thinkingAbortController) thinkingAbortController.abort();
                displayConversation(link.dataset.chatId);
            }
        });
        
        // --- Input Avanzado Listeners
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadMenu.style.display = uploadMenu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => { uploadMenu.style.display = 'none'; modelPopover.style.display = 'none'; });
        uploadMenu.addEventListener('click', (e) => {
            e.preventDefault();
            const action = e.target.closest('.upload-item')?.dataset.action;
            if (action) fileInput.click();
            uploadMenu.style.display = 'none';
        });
        webSearchBtn.addEventListener('click', () => {
            isWebSearchEnabled = !isWebSearchEnabled;
            webSearchBtn.classList.toggle('active', isWebSearchEnabled);
        });

        // --- Barra de Acciones Listener
        chatBox.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            const codeCopyBtn = e.target.closest('.copy-code-btn-inner');

            if (actionBtn) {
                const wrapper = e.target.closest('.message-wrapper');
                const messageDiv = wrapper.querySelector('.message');
                const messageIndex = parseInt(wrapper.dataset.index, 10);
                const action = actionBtn.dataset.action;

                if (action === 'copy') navigator.clipboard.writeText(messageDiv.innerText);
                if (action === 'speak') {
                    const utterance = new SpeechSynthesisUtterance(messageDiv.innerText);
                    speechSynthesis.speak(utterance);
                }
                if (action === 'regenerate') regenerateLastResponse(messageIndex);
            }
            if(codeCopyBtn){
                 navigator.clipboard.writeText(e.target.closest('.code-block').querySelector('code').innerText);
            }
        });
        
        // --- Otros Listeners (sin cambios mayores)
        modelSelectorBtn.addEventListener('click', (e) => { e.stopPropagation(); modelPopover.style.display = modelPopover.style.display === 'block' ? 'none' : 'block'; });
        modelPopover.addEventListener('click', (e) => { /* ... */ });
        settingsModal.addEventListener('show.bs.modal', () => { /* ... */ });
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // --- INICIALIZACIÓN ---
    initialize();
});