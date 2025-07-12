document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    //  1. ELEMENTOS DEL DOM Y ESTADO GLOBAL
    // =================================================================================
    
    // --- Elemento clave para detectar la página de chat
    const chatArea = document.getElementById('chat-area');

    // Si no estamos en la página del chat, no hacemos nada.
    if (!chatArea) {
        // Podríamos tener lógica para otras páginas aquí si fuera necesario.
        console.log("No estamos en la página de chat, script no inicializado.");
        return;
    }

    // --- Elementos principales
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatHistory = document.getElementById('chat-history');
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
    const liteLLMUrlInput = document.getElementById('liteLLMUrl');
    const themeSelector = document.getElementById('theme-selector');
    const notificationsSwitch = document.getElementById('notifications-switch');
    const defaultModelSelect = document.getElementById('default-model-select');

    // --- Estado Global
    let conversations = {};
    let currentChatId = null;
    let availableModels = [];
    let appSettings = {};
    let isWebSearchEnabled = false;
    let thinkingAbortController = null;

    // =================================================================================
    //  2. FUNCIONES DE INICIALIZACIÓN Y CONFIGURACIÓN
    // =================================================================================

    const initialize = async () => {
        loadSettings();
        applyTheme();
        await loadConversations(); // Cargar conversaciones al inicio
        renderChatHistory();
        fetchAndRenderModels();
        setupEventListeners();
        chatArea.classList.remove('chat-started');
    };

    const loadSettings = () => {
        // Cargar desde el objeto serverData inyectado en el EJS
        appSettings = serverData.userSettings;
        
        // Rellenar los inputs del modal de configuración
        if (apiKeyInput) apiKeyInput.value = appSettings.apiKey;
        if (liteLLMUrlInput) liteLLMUrlInput.value = appSettings.liteLLMUrl;
        if (themeSelector) {
            const themeInput = themeSelector.querySelector(`input[name="theme"][value="${appSettings.theme}"]`);
            if (themeInput) themeInput.checked = true;
        }
        if (defaultModelSelect) {
            defaultModelSelect.value = appSettings.defaultModel;
        }
        // notificationsSwitch no está en la DB, se puede manejar localmente si se desea
    };

    const saveSettings = async () => {
        const activeTab = settingsModal.querySelector('#v-pills-tab .nav-link.active');
        
        if (activeTab && activeTab.getAttribute('data-bs-target') === '#v-pills-profile') {
            const profileForm = document.getElementById('profile-form');
            if(profileForm) profileForm.submit();
            return; // Salir para no ejecutar el resto de la lógica
        }

        // Recopilar todos los datos de configuración de forma segura
        const settingsToSave = {
            apiKey: apiKeyInput ? apiKeyInput.value.trim() : '',
            liteLLMUrl: liteLLMUrlInput ? liteLLMUrlInput.value.trim() : '',
            theme: appSettings.theme, // default
            defaultModel: appSettings.defaultModel, // default
        };

        if (themeSelector) {
            const selectedThemeInput = themeSelector.querySelector('input[name="theme"]:checked');
            if (selectedThemeInput) {
                settingsToSave.theme = selectedThemeInput.value;
            }
        }

        // El selector de modelo por defecto está deshabilitado, así que no intentamos leerlo.
        // Mantenemos el valor que ya teníamos desde el selector principal.

        try {
            const response = await fetch('/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settingsToSave)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                throw new Error(errorData.error || 'Error al guardar la configuración.');
            }

            // Actualizar el estado local de appSettings
            appSettings = { ...appSettings, ...settingsToSave };

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Configuración guardada!',
                showConfirmButton: false,
                timer: 2000
            });

            applyTheme();
            fetchAndRenderModels(); // Recargar modelos si la URL/Key cambió
            bootstrap.Modal.getInstance(settingsModal).hide();

        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'No se pudo guardar.',
                text: error.message,
                showConfirmButton: false,
                timer: 3000
            });
        }
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

    const loadConversations = async () => {
        try {
            const response = await fetch('/chat/conversations');
            if (!response.ok) throw new Error('Error al cargar conversaciones desde DB.');
            const data = await response.json();
            conversations = {};
            data.forEach(conv => {
                conversations[conv.id] = {
                    id: conv.id,
                    title: conv.title,
                    messages: conv.messages.map(msg => ({ role: msg.role, content: msg.content }))
                };
            });
            
            // Si no hay conversaciones cargadas desde la DB, asegurar que no haya un chat actual
            if (Object.keys(conversations).length === 0) {
                currentChatId = null;
                chatArea.classList.remove('chat-started'); // Asegurar que el área de chat esté limpia
            } else {
                // Si hay conversaciones, asegurar que haya un chat actual válido
                if (!currentChatId || !conversations[currentChatId]) {
                    const latestChatId = Object.keys(conversations).sort((a, b) => b - a)[0];
                    currentChatId = latestChatId;
                }
                displayConversation(currentChatId);
            }
        } catch (error) {
            console.error('Error al cargar conversaciones:', error);
            // Si falla la carga de DB y no hay conversaciones, asegurar que no haya un chat actual
            if (Object.keys(conversations).length === 0) {
                currentChatId = null;
                chatArea.classList.remove('chat-started');
            } else {
                const latestChatId = Object.keys(conversations).sort((a, b) => b - a)[0];
                currentChatId = latestChatId;
                displayConversation(currentChatId);
            }
        }
    };

    const saveConversations = () => {
        // Ya no guardamos el historial completo en localStorage
    };
    
    const startNewChat = () => {
        if (thinkingAbortController) {
            thinkingAbortController.abort();
            thinkingAbortController = null;
        }
        currentChatId = null;
        chatBox.innerHTML = '';
        chatArea.classList.remove('chat-started');
        userInput.value = '';
        userInput.focus();
        renderChatHistory(); // Para quitar la selección activa del sidebar
    };

    const displayConversation = async (chatId) => {
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

    const regenerateLastResponse = async (messageIndex) => {
        if (!currentChatId || thinkingAbortController) return;

        // Eliminar la última respuesta del bot del historial de mensajes
        conversations[currentChatId].messages.splice(messageIndex);
        // No es necesario guardar el último mensaje del usuario de nuevo, ya está en la DB
        
        // Volver a renderizar la conversación sin la última respuesta
        await displayConversation(currentChatId);

        // Reenviar la última pregunta del usuario
        handleFormSubmit(); 
    };

    const saveMessageToDB = async (chatId, role, content) => {
        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, role, content })
            });
            if (!response.ok) {
                console.error('Error al guardar mensaje en DB:', response.statusText);
            }
        } catch (error) {
            console.error('Error de red al guardar mensaje en DB:', error);
        }
    };

    // fetchMessagesFromDB ya no es necesario como función separada, se incluye en loadConversations
    // y los mensajes se cargan directamente con la conversación.

    // =================================================================================
    //  4. MANIPULACIÓN DE LA UI (INCLUYE BARRA DE ACCIONES Y HIGHLIGHT.JS)
    // =================================================================================
    
    const renderChatHistory = () => {
        chatHistory.innerHTML = '';
        // Ordenar por ID de conversación (que es un timestamp) para mostrar los más recientes primero
        Object.values(conversations).sort((a, b) => b.id - a.id).forEach(chat => {
            const li = document.createElement('li');
            li.classList.add('nav-item', 'mb-1');
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <a href="#" class="nav-link flex-grow-1" data-chat-id="${chat.id}">${chat.title}</a>
                    <button class="btn btn-sm btn-outline-danger delete-chat-btn" data-chat-id="${chat.id}" title="Eliminar chat">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            chatHistory.appendChild(li);
        });
        const activeLink = chatHistory.querySelector(`.nav-link[data-chat-id="${currentChatId}"]`);
        if (activeLink) activeLink.classList.add('active');
    };

    const addMessageToUI = (sender, text, messageIndex, rawData = null) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('message-wrapper', sender);
        wrapper.dataset.index = messageIndex;

        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        if (sender === 'user') {
            messageHeader.innerHTML = `<i class="bi bi-person"></i> User`;
        } else {
            const modelName = rawData && rawData.model ? `<span class="model-name-tag">${rawData.model}</span>` : '';
            messageHeader.innerHTML = `<i class="bi bi-robot"></i> Assistant ${modelName}`;
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        marked.setOptions({
            highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: 'language-',
            breaks: true
        });

        messageDiv.innerHTML = marked.parse(text);
        
        wrapper.appendChild(messageHeader);
        wrapper.appendChild(messageContent);
        messageContent.appendChild(messageDiv);
        
        if (sender === 'assistant') {
            const footer = document.createElement('div');
            footer.className = 'message-footer';
            
            const stats = document.createElement('div');
            stats.className = 'message-stats';
            if (rawData && rawData.usage) {
                const time = rawData.created ? (new Date() - new Date(rawData.created * 1000)) / 1000 : 0;
                stats.innerHTML = `
                    <span><i class="bi bi-clock"></i> ${time.toFixed(2)}s</span>
                    <span><i class="bi bi-box-arrow-in-down"></i> In: ${rawData.usage.prompt_tokens}</span>
                    <span><i class="bi bi-box-arrow-up"></i> Out: ${rawData.usage.completion_tokens}</span>
                    <span><i class="bi bi-hash"></i> Total: ${rawData.usage.total_tokens}</span>
                `;
            }
            
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="action-btn" data-action="copy" title="Copiar"><i class="bi bi-clipboard"></i></button>
                <button class="action-btn" data-action="speak" title="Leer en voz alta"><i class="bi bi-volume-up"></i></button>
                <button class="action-btn" data-action="regenerate" title="Regenerar"><i class="bi bi-arrow-clockwise"></i></button>
                ${rawData ? `<button class="action-btn show-json-btn" title="Mostrar JSON"><i class="bi bi-code-slash"></i></button>` : ''}
            `;
            
            footer.appendChild(stats);
            footer.appendChild(actions);
            wrapper.appendChild(footer);

            if (rawData) {
                const jsonContainer = document.createElement('div');
                jsonContainer.className = 'json-response-container';
                jsonContainer.style.display = 'none';
                jsonContainer.innerHTML = `
                    <div class="code-block">
                        <div class="code-header">
                            <span>JSON Response</span>
                            <button class="copy-code-btn-inner"><i class="bi bi-clipboard"></i></button>
                        </div>
                        <pre><code class="language-json">${JSON.stringify(rawData, null, 2)}</code></pre>
                    </div>
                `;
                wrapper.appendChild(jsonContainer);
            }
        }

        chatBox.appendChild(wrapper);
        messageDiv.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        if (rawData) {
            const jsonCodeBlock = wrapper.querySelector('.json-response-container pre code.language-json');
            if (jsonCodeBlock) hljs.highlightElement(jsonCodeBlock);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // =================================================================================
    //  5. LÓGICA DE API Y MODELOS
    // =================================================================================

    const fetchAndRenderModels = async () => {
        modelSelectorBtn.textContent = appSettings.defaultModel || 'Seleccionar Modelo';
        if (!appSettings.apiKey || !appSettings.liteLLMUrl) {
            modelSelectorBtn.textContent = 'Configure URL y API Key';
            return;
        }
        try {
            const headers = { 'Authorization': `Bearer ${appSettings.apiKey}` };
            const response = await fetch(`${appSettings.liteLLMUrl}/models`, { headers });
            if (!response.ok) throw new Error('URL o API Key inválida.');
            const data = await response.json();
            console.log(data)
            availableModels = data.data;
            renderModelList(availableModels); // Renderizar la lista inicial
            if (defaultModelSelect) {
                defaultModelSelect.innerHTML = availableModels.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
                defaultModelSelect.value = appSettings.defaultModel;
            }
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            modelSelectorBtn.textContent = 'Error de API Key';
        }
    };

    const renderModelList = (modelsToRender) => {
        modelPopover.innerHTML = `
            <input type="text" id="model-search-input" class="form-control form-control-sm mb-2" placeholder="Buscar modelo...">
            <div id="model-items-container"></div>
        `;
        const modelSearchInput = document.getElementById('model-search-input');
        const modelItemsContainer = document.getElementById('model-items-container');

        modelSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredModels = availableModels.filter(model => 
                model.id.toLowerCase().includes(searchTerm) || 
                (modelDescriptions[model.id] && modelDescriptions[model.id].toLowerCase().includes(searchTerm))
            );
            displayFilteredModels(filteredModels, modelItemsContainer);
        });

        const modelDescriptions = { 
            'gpt-4o-mini': 'Rápido e inteligente.', 
            'gpt-4o': 'El modelo más potente.', 
            'gemini/gemini-1.5-pro-latest': 'Gran ventana de contexto.', 
            'coder-large': 'Especializado en código.' 
        };

        const displayFilteredModels = (models, container) => {
            container.innerHTML = '';
            models.forEach(model => {
                const item = document.createElement('div');
                item.className = `model-item ${model.id === appSettings.defaultModel ? 'active' : ''}`;
                item.dataset.modelId = model.id;
                const createdDate = new Date(model.created * 1000).toLocaleString();
                item.innerHTML = `
                    <div class="model-title"><strong>${model.id}</strong></div>
                   
                    <small class="text-muted">Creado: ${createdDate}</small>
                `;
                //  <div class="model-desc">${modelDescriptions[model.id] || 'Modelo disponible.'}</div>
                // <small class="text-muted">Propietario: ${model.owned_by}</small><br></br>
                container.appendChild(item);
            });
        };
        displayFilteredModels(modelsToRender, modelItemsContainer); // Mostrar todos los modelos al inicio
    };
    
    const handleFormSubmit = async (isRegeneration = false) => {
        if (!isRegeneration) {
            const messageText = userInput.value.trim();
            if (!messageText) return;
            let prompt = messageText;
            if (isWebSearchEnabled) {
                prompt = `[Búsqueda web activada] ${messageText}`;
                isWebSearchEnabled = false;
                webSearchBtn.classList.remove('active');
            }
            // Si no hay chat actual, o si el chat actual no tiene mensajes (es un chat nuevo sin interacción),
            // crear una nueva conversación en la DB.
            if (!currentChatId || !conversations[currentChatId] || conversations[currentChatId].messages.length === 0) {
                const response = await fetch('/chat/conversation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: 'Nuevo Chat' }) // Título temporal
                });
                if (!response.ok) throw new Error('Error al crear nueva conversación en DB.');
                const newConversation = await response.json();
                currentChatId = newConversation.id;
                conversations[currentChatId] = { 
                    id: newConversation.id, 
                    title: newConversation.title, 
                    messages: [] 
                };
                renderChatHistory(); // Renderizar para mostrar el nuevo chat en el sidebar
            }

            addMessageToUI('user', prompt, conversations[currentChatId].messages.length);
            conversations[currentChatId].messages.push({ role: 'user', content: prompt });
            await saveMessageToDB(currentChatId, 'user', prompt); // Guardar mensaje del usuario en DB
            userInput.value = '';
        }
        
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'message-wrapper bot';
        thinkingMessage.innerHTML = '<div class="message bot thinking">Kipux está pensando...</div>';
        chatBox.appendChild(thinkingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            if (!appSettings.apiKey || !appSettings.liteLLMUrl) throw new Error("Por favor, configura la URL y la API Key.");
            thinkingAbortController = new AbortController();
            const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${appSettings.apiKey}` };
            const response = await fetch(`${appSettings.liteLLMUrl}/chat/completions`, {
                method: 'POST', headers, signal: thinkingAbortController.signal,
                body: JSON.stringify({ model: appSettings.defaultModel, messages: conversations[currentChatId].messages })
            });
            if (!response.ok) throw new Error(`Error de API: ${response.statusText} (${response.status})`);
            const data = await response.json();
            console.log('Respuesta completa del modelo:', data);
            const botReply = data.choices[0].message.content;
            
            // Si es la primera respuesta del bot en un nuevo chat, actualizar el título
            // Esto se ejecuta después de que el usuario ha enviado su primer mensaje y el bot ha respondido.
            if (conversations[currentChatId].messages.length === 1) { // Solo el mensaje del usuario está presente
                const newTitle = conversations[currentChatId].messages[0].content.substring(0, 30);
                conversations[currentChatId].title = newTitle;
                try {
                    await fetch(`/chat/conversation/${currentChatId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle })
                    });
                    renderChatHistory(); // Volver a renderizar para mostrar el nuevo título en el sidebar
                } catch (error) {
                    console.error('Error al actualizar título de conversación:', error);
                }
            }

            if (thinkingMessage && chatBox.contains(thinkingMessage)) {
                chatBox.removeChild(thinkingMessage);
            }
            const botMessageIndex = conversations[currentChatId].messages.length;
            addMessageToUI('assistant', botReply, botMessageIndex, data);
            conversations[currentChatId].messages.push({ role: 'assistant', content: botReply });
            await saveMessageToDB(currentChatId, 'assistant', botReply);
            // renderChatHistory() ya se llama si se actualiza el título, no es necesario aquí de nuevo
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
        
        chatHistory.addEventListener('click', async (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                if (thinkingAbortController) thinkingAbortController.abort();
                await displayConversation(parseInt(link.dataset.chatId)); // Asegurarse de que sea un número
            }
        });

        chatHistory.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-chat-btn');
            if (deleteBtn) {
                e.preventDefault();
                e.stopPropagation(); // Evitar que el clic se propague al enlace del chat
                const chatIdToDelete = parseInt(deleteBtn.dataset.chatId);
                
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminarlo!',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await fetch(`/chat/conversation/${chatIdToDelete}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                            });
                            if (!response.ok) throw new Error('Error al eliminar la conversación.');
                            
                            delete conversations[chatIdToDelete];
                            renderChatHistory();
                            Swal.fire('Eliminado!', 'El chat ha sido eliminado.', 'success');

                            // Si el chat eliminado era el actual, iniciar uno nuevo
                            if (currentChatId === chatIdToDelete) {
                                currentChatId = null; // Resetear currentChatId
                                startNewChat();
                            }
                        } catch (error) {
                            console.error('Error al eliminar chat:', error);
                            Swal.fire('Error!', 'No se pudo eliminar el chat.', 'error');
                        }
                    }
                });
            } else {
                const link = e.target.closest('a');
                if (link) {
                    e.preventDefault();
                    if (thinkingAbortController) thinkingAbortController.abort();
                    await displayConversation(parseInt(link.dataset.chatId));
                }
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
            const showJsonBtn = e.target.closest('.show-json-btn'); // Nuevo botón

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
            if (showJsonBtn) { // Lógica para el nuevo botón
                const wrapper = e.target.closest('.message-wrapper');
                const jsonContainer = wrapper.querySelector('.json-response-container');
                if (jsonContainer) {
                    jsonContainer.style.display = jsonContainer.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
        
        // --- Otros Listeners (sin cambios mayores)
        modelSelectorBtn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            modelPopover.style.display = modelPopover.style.display === 'block' ? 'none' : 'block'; 
            // Enfocar el input de búsqueda al abrir el popover
            const modelSearchInput = document.getElementById('model-search-input');
            if (modelSearchInput) {
                modelSearchInput.focus();
            }
        });
        modelPopover.addEventListener('click', (e) => {
            const target = e.target.closest('.model-item');
            if (target) {
                e.preventDefault();
                const selectedModelId = target.dataset.modelId;
                modelSelectorBtn.textContent = selectedModelId;
                appSettings.defaultModel = selectedModelId;
                modelPopover.style.display = 'none';
                // Actualizar el select del modal de configuración
                if (defaultModelSelect) {
                    defaultModelSelect.value = selectedModelId;
                }

                // Mostrar toast de SweetAlert2
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'success',
                    title: `Modelo seleccionado: ${selectedModelId}`
                });
            }
        });
        settingsModal.addEventListener('show.bs.modal', () => { 
            // Asegurarse de que el tema y las notificaciones se muestren correctamente
            themeSelector.querySelectorAll('input[name="theme"]').forEach(input => {
                if (input.value === appSettings.theme) {
                    input.checked = true;
                }
            });
            notificationsSwitch.checked = appSettings.notifications;
            if (defaultModelSelect) {
                defaultModelSelect.value = appSettings.defaultModel;
            }
        });
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // --- INICIALIZACIÓN ---
    initialize();
});
