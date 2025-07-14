document.addEventListener("DOMContentLoaded", () => {
  // =================================================================================
  //  1. ELEMENTOS DEL DOM Y ESTADO GLOBAL
  // =================================================================================

  // --- Elemento clave para detectar la página de chat
  const chatArea = document.getElementById("chat-area");

  // Si no estamos en la página del chat, no hacemos nada.
  if (!chatArea) {
    // Podríamos tener lógica para otras páginas aquí si fuera necesario.
    console.log("No estamos en la página de chat, script no inicializado.");
    return;
  }

  // --- Elementos principales
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const newChatBtn = document.getElementById("new-chat-btn");
  const chatHistory = document.getElementById("chat-history");
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");

  // --- Formulario de Input Avanzado
  const userInput = document.getElementById("user-input");
  const uploadBtn = document.getElementById("upload-btn");
  const uploadMenu = document.getElementById("upload-menu");
  const fileInput = document.getElementById("file-input");
const searchToggleButton = document.getElementById("search-toggle-btn");

  // --- Selector de Modelos
  const modelSelectorBtn = document.getElementById("model-selector-btn");
  const modelPopover = document.getElementById("model-popover");

  // --- Modal de Configuración
  const settingsModal = document.getElementById("settingsModal");
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const apiKeyInput = document.getElementById("apiKey");
  const liteLLMUrlInput = document.getElementById("liteLLMUrl");
  const defaultModelSelect = document.getElementById("default-model-select");

  const creditsCounter = document.getElementById("credits-counter");
  const creditsDisplay = document.getElementById("credits-display"); // El div contenedor del contador

  // --- Estado Global
  let conversations = {};
  let currentChatId = null;
  let availableModels = [];
  let appSettings = {};
  let thinkingAbortController = null;
  let bootstrapTooltip = null;

  // =================================================================================
  //  2. FUNCIONES DE INICIALIZACIÓN Y CONFIGURACIÓN
  // =================================================================================

  const initialize = async () => {
    loadSettings()
    setupEventListeners()
    if (creditsDisplay) {
        bootstrapTooltip = new bootstrap.Tooltip(creditsDisplay);
    }
    await Promise.all([
        loadConversations(),
        fetchAndRenderModels(),
        fetchAndDisplayUserCredits()
    ]);
    
    renderChatHistory()
    
  };

  const loadSettings = () => {
    // Cargar desde el objeto serverData inyectado en el EJS
    appSettings = serverData.userSettings;

    // Rellenar los inputs del modal de configuración
    if (apiKeyInput) apiKeyInput.value = appSettings.apiKey;
    if (liteLLMUrlInput) liteLLMUrlInput.value = appSettings.liteLLMUrl;
  };

  const saveSettings = async () => {
    const activeTab = settingsModal.querySelector(
      "#v-pills-tab .nav-link.active"
    );

    if (
      activeTab &&
      activeTab.getAttribute("data-bs-target") === "#v-pills-profile"
    ) {
      const profileForm = document.getElementById("profile-form");
      if (profileForm) profileForm.submit();
      return; // Salir para no ejecutar el resto de la lógica
    }

    // Recopilar todos los datos de configuración de forma segura
    const settingsToSave = {
      apiKey: apiKeyInput ? apiKeyInput.value.trim() : "",
      liteLLMUrl: liteLLMUrlInput ? liteLLMUrlInput.value.trim() : "",
    };

    try {
      const response = await fetch("/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Error desconocido" }));
        throw new Error(
          errorData.error || "Error al guardar la configuración."
        );
      }

      // Actualizar el estado local de appSettings
      appSettings = { ...appSettings, ...settingsToSave };

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Configuración guardada!",
        showConfirmButton: false,
        theme: "dark",
        timer: 2000,
      });

      fetchAndRenderModels(); // Recargar modelos si la URL/Key cambió
      bootstrap.Modal.getInstance(settingsModal).hide();
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se pudo guardar.",
        text: error.message,
        theme: "dark",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  // =================================================================================
  //  3. GESTIÓN DE CONVERSACIONES
  // =================================================================================

  const loadConversations = async () => {
    try {
      const response = await fetch("/chat/conversations");
      if (!response.ok)
        throw new Error("Error al cargar conversaciones desde DB.");
      const data = await response.json();
      // console.log(data)
      conversations = {};
      data.forEach((conv) => {
        conversations[conv.id] = {
          id: conv.id,
          title: conv.title,
          messages: conv.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            metadata: msg.metadata
          })),
        };
      });

      // Si no hay conversaciones cargadas desde la DB, asegurar que no haya un chat actual
      if (Object.keys(conversations).length === 0) {
        currentChatId = null;
        chatArea.classList.remove("chat-started"); // Asegurar que el área de chat esté limpia
      } else {
        // Si hay conversaciones, asegurar que haya un chat actual válido
        if (!currentChatId || !conversations[currentChatId]) {
          const latestChatId = Object.keys(conversations).sort(
            (a, b) => b - a
          )[0];
          // currentChatId = latestChatId;
        }
        // displayConversation(currentChatId);
      }
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
      // Si falla la carga de DB y no hay conversaciones, asegurar que no haya un chat actual
      // if (Object.keys(conversations).length === 0) {
      //   currentChatId = null;
      //   chatArea.classList.remove("chat-started");
      // } else {
      //   const latestChatId = Object.keys(conversations).sort(
      //     (a, b) => b - a
      //   )[0];
      //   currentChatId = latestChatId;
      //   displayConversation(currentChatId);
      // }
    }
  };

  const startNewChat = () => {
    if (thinkingAbortController) {
      thinkingAbortController.abort();
      thinkingAbortController = null;
    }
    currentChatId = null;
    chatBox.innerHTML = "";
    chatArea.classList.remove("chat-started");
    userInput.value = "";
    userInput.focus();
    renderChatHistory(); // Para quitar la selección activa del sidebar
  };

  const displayConversation = async (chatId) => {
    currentChatId = chatId;
    chatBox.innerHTML = "";
    if (conversations[chatId]) {
      conversations[chatId].messages.forEach((msg, index) => {
        addMessageToUI(msg.role, msg.content, index, msg.metadata);
      });
    }
    chatArea.classList.add("chat-started");
    renderChatHistory();
    userInput.focus();
  };

  const saveMessageToDB = async (chatId, role, content, metadata) => {
    try {
      const response = await fetch("/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, role, content, metadata }),
      });
      if (!response.ok) {
        console.error("Error al guardar mensaje en DB:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red al guardar mensaje en DB:", error);
    }
  };

  // =================================================================================
  //  4. MANIPULACIÓN DE LA UI (INCLUYE BARRA DE ACCIONES Y HIGHLIGHT.JS)
  // =================================================================================
  const renderChatHistory = () => {
      chatHistory.innerHTML = "";
      
      // 1. Definimos la longitud máxima del título
      const MAX_TITLE_LENGTH = 20; // <--- PUEDES AJUSTAR ESTE NÚMERO

      Object.values(conversations)
        .sort((a, b) => b.id - a.id)
        .forEach((chat) => {
          
          // 2. Lógica para acortar el título
          let displayTitle = chat.title;
          if (displayTitle.length > MAX_TITLE_LENGTH) {
              displayTitle = displayTitle.substring(0, MAX_TITLE_LENGTH) + "...";
          }

          const li = document.createElement("li");
          li.classList.add("nav-item");

          // 3. Usamos el título acortado (displayTitle) en el HTML
          li.innerHTML = `
              <a href="#" class="nav-link d-flex justify-content-between align-items-center" data-chat-id="${chat.id}">
                  
                  <!-- Ahora usamos la variable 'displayTitle' -->
                  <span class="chat-title-text">${displayTitle}</span>

                  <button class="btn delete-chat-btn" data-chat-id="${chat.id}" title="Eliminar chat">
                      <i class="bi bi-trash3"></i>
                  </button>

              </a>
          `;
          chatHistory.appendChild(li);
        });

      // Esta parte se queda igual
      const activeLink = chatHistory.querySelector(
        `.nav-link[data-chat-id="${currentChatId}"]`
      );
      if (activeLink) activeLink.classList.add("active");
  };

  const addMessageToUI = (sender, text, messageIndex, rawData = null) => {
    console.log(rawData)
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", sender);
    wrapper.dataset.index = messageIndex;

    const messageHeader = document.createElement("div");
    messageHeader.className = "message-header";

    if (sender === "user") {
      messageHeader.innerHTML = `<i class="bi bi-person"></i> User`;
    } else {
      const modelName =
        rawData && rawData.model
          ? `<span class="model-name-tag">${rawData.model}</span>`
          : "";
      messageHeader.innerHTML = `<i class="bi bi-robot"></i> Assistant ${modelName}`;
    }

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    marked.setOptions({
      highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: "language-",
      breaks: true,
    });

    messageDiv.innerHTML = marked.parse(text);

    wrapper.appendChild(messageHeader);
    wrapper.appendChild(messageContent);
    messageContent.appendChild(messageDiv);

    if (sender === "assistant") {
      const footer = document.createElement("div");
      footer.className = "message-footer";

      const stats = document.createElement("div");
      stats.className = "message-stats";
      if (rawData && rawData.usage) {
        const time = rawData.created
          ? (new Date() - new Date(rawData.created * 1000)) / 1000
          : 0;
        stats.innerHTML = `
                    <span><i class="bi bi-clock"></i> ${time.toFixed(2)}s</span>
                    <span><i class="bi bi-box-arrow-in-down"></i> In: ${
                      rawData.usage.prompt_tokens
                    }</span>
                    <span><i class="bi bi-box-arrow-up"></i> Out: ${
                      rawData.usage.completion_tokens
                    }</span>
                    <span><i class="bi bi-hash"></i> Total: ${
                      rawData.usage.total_tokens
                    }</span>
                `;
      }

      const actions = document.createElement("div");
      actions.className = "message-actions";
      actions.innerHTML = `
                <button class="action-btn" data-action="copy" title="Copiar"><i class="bi bi-clipboard"></i></button>
                <button class="action-btn" data-action="speak" title="Leer en voz alta"><i class="bi bi-volume-up"></i></button>
                <button class="action-btn" data-action="regenerate" title="Regenerar"><i class="bi bi-arrow-clockwise"></i></button>
                ${
                  rawData
                    ? `<button class="action-btn show-json-btn" title="Mostrar JSON"><i class="bi bi-code-slash"></i></button>`
                    : ""
                }
            `;

      footer.appendChild(stats);
      footer.appendChild(actions);
      wrapper.appendChild(footer);

      if (rawData) {
        const jsonContainer = document.createElement("div");
        jsonContainer.className = "json-response-container";
        jsonContainer.style.display = "none";
        jsonContainer.innerHTML = `
                    <div class="code-block">
                        <div class="code-header">
                            <span>JSON Response</span>
                            <button class="copy-code-btn-inner"><i class="bi bi-clipboard"></i></button>
                        </div>
                        <pre><code class="language-json">${JSON.stringify(
                          rawData,
                          null,
                          2
                        )}</code></pre>
                    </div>
                `;
        wrapper.appendChild(jsonContainer);
      }
    }

    chatBox.appendChild(wrapper);
    messageDiv
      .querySelectorAll("pre code")
      .forEach((block) => hljs.highlightElement(block));
    if (rawData) {
      const jsonCodeBlock = wrapper.querySelector(
        ".json-response-container pre code.language-json"
      );
      if (jsonCodeBlock) hljs.highlightElement(jsonCodeBlock);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // =================================================================================
  //  5. LÓGICA DE API Y MODELOS
  // =================================================================================

  const fetchAndRenderModels = async () => {
    modelSelectorBtn.textContent =
      appSettings.defaultModel || "Seleccionar Modelo";
    if (!appSettings.apiKey || !appSettings.liteLLMUrl) {
      modelSelectorBtn.textContent = "Configure URL y API Key";
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${appSettings.apiKey}` };
      const response = await fetch(`${appSettings.liteLLMUrl}/model/info`, {
        headers,
      });
      if (!response.ok) throw new Error("URL o API Key inválida.");
      const data = await response.json();
      availableModels = data.data;
      renderModelList(availableModels); // Renderizar la lista inicial
      if (defaultModelSelect) {
        defaultModelSelect.innerHTML = availableModels
          .map((m) => `<option value="${m.id}">${m.id}</option>`)
          .join("");
        defaultModelSelect.value = appSettings.defaultModel;
      }
    } catch (error) {
      console.error("Error al obtener modelos:", error);
      modelSelectorBtn.textContent = "Error de API Key";
    }
  };

  const renderModelList = (modelsToRender) => {
    modelPopover.innerHTML = `
            <input type="text" id="model-search-input" class="form-control form-control-sm mb-2" placeholder="Buscar modelo...">
            <div id="model-items-container"></div>
        `;
    const modelSearchInput = document.getElementById("model-search-input");
    const modelItemsContainer = document.getElementById(
      "model-items-container"
    );

    modelSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredModels = availableModels.filter(
        (model) => model.model_name.toLowerCase().includes(searchTerm) 
      );
      displayFilteredModels(filteredModels, modelItemsContainer);
    });

    const displayFilteredModels =  (models, container) => {
      container.innerHTML = "";
      // console.log(models)
      models.forEach(async (model) => {
        if (model.model_info.mode =="chat") {
        
          const item = document.createElement("div");
          item.className = `model-item ${
            model.model_name === appSettings.defaultModel ? "active" : ""
          }`;
          item.dataset.modelId = model.model_name;
          item.innerHTML = `
                    <div class="model-title"><strong>${model.model_name}</strong></div>
                    <small class="text-muted">Proveedor: ${model.litellm_params.custom_llm_provider} | Token Input: ${model.model_info.max_input_tokens} | Token Output: ${model.model_info.max_output_tokens}</small>
                `;
          container.appendChild(item);
        }  
      });
      
    };
    displayFilteredModels(modelsToRender, modelItemsContainer);
  };

 const handleFormSubmit = async () => {
  const messageContent = userInput.value.trim();  
  if (!messageContent) return; // No enviar mensajes vacíos
  thinkingAbortController = new AbortController();
  const thinkingMessage = document.createElement("div");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${appSettings.apiKey}`,
  };
  userInput.value = "";
  console.log(currentChatId)
  try {
    if (currentChatId == null) {
      // Nuevo chat
      // console.log("creando chat...")
      let response = await fetch("/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nuevo Chat" }),
      });
      const newConversation = await response.json();
      // console.log(newConversation)
      currentChatId = newConversation.id;
      conversations[currentChatId] = {
        id: newConversation.id,
        title: newConversation.title,
        messages: [{
          role: "user",
          content: messageContent,
        }],
      };
      displayConversation(currentChatId)
      await saveMessageToDB(currentChatId, "user", messageContent, {
        model: appSettings.defaultModel,
        date: Date.now(), 
      });
      
      // ia--------
      thinkingMessage.className = "message-wrapper bot";
      thinkingMessage.innerHTML =
        '<div class="message bot thinking">Kipux está pensando...</div>';
      chatBox.appendChild(thinkingMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      response = await fetch(`${appSettings.liteLLMUrl}/chat/completions`,
        {
          method: "POST",
          headers,
          signal: thinkingAbortController.signal,
          body: JSON.stringify({
            model: appSettings.defaultModel,
            messages: conversations[currentChatId].messages,
          }),
        }
      );
      const data = await response.json();
      // console.log(data)
      await saveMessageToDB(currentChatId, "assistant", data.choices[0].message.content, data.usage);
      await fetch(`/chat/conversation/${currentChatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.choices[0].message.content }),
      });
      conversations[currentChatId].title = data.choices[0].message.content;
      conversations[currentChatId].messages.push({
        role: "assistant",
        content: data.choices[0].message.content,
      });
      displayConversation(currentChatId)
      renderChatHistory()
    } else {
      // Chat existente
      conversations[currentChatId].messages.push({
        role: "user",
        content: messageContent,
      });
      displayConversation(currentChatId)
      await saveMessageToDB(currentChatId, "user", messageContent, {
        model: appSettings.defaultModel,
        date: Date.now(), 
      });

      thinkingMessage.className = "message-wrapper bot";
      thinkingMessage.innerHTML =
        '<div class="message bot thinking">Kipux está pensando...</div>';
      chatBox.appendChild(thinkingMessage);
      chatBox.scrollTop = chatBox.scrollHeight;

      console.log(conversations[currentChatId].messages)
      response = await fetch(`${appSettings.liteLLMUrl}/chat/completions`,
        {
          method: "POST",
          headers,
          signal: thinkingAbortController.signal,
          body: JSON.stringify({
            model: appSettings.defaultModel,
            messages: conversations[currentChatId].messages,
          }),
        }
      );
      const data = await response.json();
      await saveMessageToDB(currentChatId, "assistant", data.choices[0].message.content, data.usage);
      conversations[currentChatId].messages.push({
        role: "assistant",
        content: data.choices[0].message.content,
      });
      displayConversation(currentChatId)
    }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const fetchAndDisplayUserCredits = async () => {
      // 1. Verificaciones iniciales para asegurar que tenemos todo lo necesario
      if (!creditsCounter || !appSettings.liteLLMUrl || !appSettings.apiKey) {
        if (creditsCounter) creditsCounter.textContent = 'Configure URL/Key';
        return;
      }

      try {
          // 2. Hacemos la llamada a la API que ya confirmamos que funciona (con GET)
          const response = await fetch(`${appSettings.liteLLMUrl}/key/info`, {
              headers: {
                  'Authorization': `Bearer ${appSettings.apiKey}`,
                  'Content-Type': 'application/json',
              },
          });

          // 3. Manejo de errores de conexión o autenticación
          if (!response.ok) {
              console.error("Error de API al obtener créditos:", response.status);
              creditsCounter.textContent = 'Créditos no disponibles';
              return;
          }

          // 4. Procesamos el JSON que nos devuelve la API
          const keyInfo = await response.json();
          console.log(appSettings.apiKey)
          console.log(keyInfo)
          // 5. Verificamos que la respuesta tenga la estructura esperada
          if (!keyInfo || !keyInfo.info) {
              creditsCounter.textContent = 'Respuesta de API inválida';
              return;
          }

          // --- EXTRACCIÓN DE DATOS DEL JSON (A MEDIDA PARA TI) ---
          const info = keyInfo.info;
          const spend = info.spend || 0;
          const maxBudget = info.max_budget; // Puede ser null
          const createdAtISO = info.created_at;
          const updatedAtISO = info.updated_at;

          // --- LÓGICA DE VISUALIZACIÓN ---

          // CASO 1: No hay un presupuesto máximo definido (max_budget es null)
          if (maxBudget === null) {
              const spendFormatted = spend.toLocaleString('es-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 });
              creditsCounter.textContent = `Gasto: ${spendFormatted}`;
              
              const tooltipText = `Gasto Total: ${spendFormatted}\n(Sin presupuesto máximo definido)`;
              if (bootstrapTooltip) {
                  bootstrapTooltip.setContent({ '.tooltip-inner': tooltipText });
              } else {
                  creditsDisplay.setAttribute('title', tooltipText);
              }
              return; // Salimos de la función aquí
          }

          // CASO 2: Sí hay un presupuesto máximo definido
          const remainingBudget = maxBudget - spend;
          creditsCounter.textContent = `Disponible: ${remainingBudget.toLocaleString('es-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 })}`;
          
          // Función interna para formatear fechas
          const formatToFriendlyDate = (isoString) => {
              if (!isoString) return "No definida";
              return new Date(isoString).toLocaleString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
              });
          };

          // Construcción del tooltip detallado
          const tooltipDetails = [
              `Presupuesto Máximo: ${maxBudget.toLocaleString('es-US', { style: 'currency', currency: 'USD' })}`,
              `Gasto Actual: ${spend.toLocaleString('es-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 })}`,
              '---',
              `Clave Creada: ${formatToFriendlyDate(createdAtISO)}`,
              `Última Actualización: ${formatToFriendlyDate(updatedAtISO)}`
          ];

          const finalTooltipText = tooltipDetails.join('\n');

          // Actualización del tooltip
          if (bootstrapTooltip) {
              bootstrapTooltip.setContent({ '.tooltip-inner': finalTooltipText });
          } else {
              creditsDisplay.setAttribute('title', finalTooltipText);
          }

      } catch (error) {
          console.error("Error de red al obtener créditos:", error);
          creditsCounter.textContent = 'Error al cargar';
          const errorText = 'No se pudo conectar para obtener los créditos.';
          if (bootstrapTooltip) bootstrapTooltip.setContent({ '.tooltip-inner': errorText });
          else creditsDisplay.setAttribute('title', errorText);
      }
  };

// =================================================================================
//  6. EVENT LISTENERS (FUNCIÓN COMPLETA Y CORREGIDA)
// =================================================================================

function setupEventListeners() {
  sidebarToggle.addEventListener("click", () =>
    sidebar.classList.toggle("hidden")
  );
  newChatBtn.addEventListener("click", startNewChat);
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit();
  });

  if (searchToggleButton) { // Buena práctica: verificar que el elemento existe
    searchToggleButton.addEventListener('click', function() {
        // Alterna la clase 'active' para cambiar el estilo CSS
        this.classList.toggle('active');

        // Opcional: Mostrar en consola si el modo está activo
        const isActive = this.classList.contains('active');
        console.log('Modo de búsqueda web:', isActive ? 'ACTIVADO' : 'DESACTIVADO');
    });
  }

  // Listener ÚNICO para el historial de chats
  chatHistory.addEventListener("click", async (e) => {
      // Primero, revisamos si el clic fue en el botón de eliminar
      const deleteBtn = e.target.closest(".delete-chat-btn");

      if (deleteBtn) {
          e.preventDefault(); // Previene la navegación del enlace padre <a>
          e.stopPropagation(); // Detiene la propagación del evento para que no active el clic del enlace

          const chatIdToDelete = parseInt(deleteBtn.dataset.chatId);
          Swal.fire({
              title: "¿Estás seguro?",
              text: "¡No podrás revertir esto!",
              icon: "warning",
              theme: "dark",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Sí, eliminarlo!",
              cancelButtonText: "Cancelar",
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      const response = await fetch(`/chat/conversation/${chatIdToDelete}`, {
                          method: "DELETE",
                      });
                      if (!response.ok) throw new Error("Error al eliminar la conversación.");

                      delete conversations[chatIdToDelete];
                      renderChatHistory(); // Vuelve a dibujar la lista sin el chat eliminado

                      if (currentChatId === chatIdToDelete) {
                          startNewChat(); // Si se eliminó el chat actual, limpia la pantalla
                      }

                      Swal.fire({
                          toast: true,
                          position: 'top-end',
                          icon: 'success',
                          title: 'Chat eliminado',
                          showConfirmButton: false,
                          timer: 2000,
                          theme: 'dark'
                      });
                  } catch (error) {
                      console.error("Error al eliminar chat:", error);
                      Swal.fire("Error!", "No se pudo eliminar el chat.", "error");
                  }
              }
          });
          
      } else {
          // Si no fue en el botón de eliminar, revisamos si fue en el enlace principal
          const link = e.target.closest(".nav-link");
          if (link) {
              e.preventDefault();
              if (thinkingAbortController) thinkingAbortController.abort();
              const chatIdToDisplay = parseInt(link.dataset.chatId);
              displayConversation(chatIdToDisplay);
          }
      }
  });

  // --- Input Avanzado Listeners
  uploadBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    uploadMenu.style.display =
      uploadMenu.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", () => {
    uploadMenu.style.display = "none";
    modelPopover.style.display = "none";
  });
  uploadMenu.addEventListener("click", (e) => {
    e.preventDefault();
    const action = e.target.closest(".upload-item")?.dataset.action;
    if (action) fileInput.click();
    uploadMenu.style.display = "none";
  });

  // --- Barra de Acciones Listener
  chatBox.addEventListener("click", (e) => {
    const actionBtn = e.target.closest(".action-btn");
    const codeCopyBtn = e.target.closest(".copy-code-btn-inner");
    const showJsonBtn = e.target.closest(".show-json-btn");

    if (actionBtn) {
      const wrapper = e.target.closest(".message-wrapper");
      const messageDiv = wrapper.querySelector(".message");
      const messageIndex = parseInt(wrapper.dataset.index, 10);
      const action = actionBtn.dataset.action;

      if (action === "copy")
        navigator.clipboard.writeText(messageDiv.innerText);
      if (action === "speak") {
        const utterance = new SpeechSynthesisUtterance(messageDiv.innerText);
        speechSynthesis.speak(utterance);
      }
      if (action === "regenerate") regenerateLastResponse(messageIndex);
    }
    if (codeCopyBtn) {
      navigator.clipboard.writeText(
        e.target.closest(".code-block").querySelector("code").innerText
      );
    }
    if (showJsonBtn) {
      const wrapper = e.target.closest(".message-wrapper");
      const jsonContainer = wrapper.querySelector(".json-response-container");
      if (jsonContainer) {
        jsonContainer.style.display =
          jsonContainer.style.display === "block" ? "none" : "block";
      }
    }
  });

  // --- Otros Listeners
  modelSelectorBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    modelPopover.style.display =
      modelPopover.style.display === "block" ? "none" : "block";
    const modelSearchInput = document.getElementById("model-search-input");
    if (modelSearchInput) {
      modelSearchInput.focus();
    }
  });
  modelPopover.addEventListener("click", (e) => {
    const target = e.target.closest(".model-item");
    if (target) {
      e.preventDefault();
      const selectedModelId = target.dataset.modelId;
      modelSelectorBtn.textContent = selectedModelId;
      appSettings.defaultModel = selectedModelId;
      modelPopover.style.display = "none";
      if (defaultModelSelect) {
        defaultModelSelect.value = selectedModelId;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "success",
        theme: "dark",
        title: `Modelo seleccionado: ${selectedModelId}`,
      });
    }
  });

  saveSettingsBtn.addEventListener("click", saveSettings);

  // --- LÓGICA PARA EL TEXTAREA (userInput) ---
  if (userInput) {
      // 1. Lógica para ajustar la altura automáticamente (ya la tenías)
      const adjustTextareaHeight = () => {
          userInput.style.height = 'auto'; // Resetea la altura
          userInput.style.height = (userInput.scrollHeight) + 'px'; // Ajusta la altura al contenido
      };
      userInput.addEventListener('input', adjustTextareaHeight);
      adjustTextareaHeight();

      // ▼▼▼ ESTE ES EL NUEVO CÓDIGO AÑADIDO ▼▼▼
      // 2. Lógica para enviar el mensaje al presionar Ctrl + Enter
      userInput.addEventListener("keydown", (event) => {
          // Comprueba si la tecla es 'Enter' Y si 'Ctrl' (o 'Cmd' en Mac) está presionada
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
              
              event.preventDefault(); // Evita que se añada una nueva línea

              // Si hay texto, llama a la función para enviar
              if (userInput.value.trim() !== "") {
                  handleFormSubmit();
              }
          }
      });
      // ▲▲▲ FIN DEL NUEVO CÓDIGO ▲▲▲
  }
}

  // --- INICIALIZACIÓN ---
  initialize();
});
