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
  const creditsDisplay = document.getElementById("credits-display");

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
    loadSettings();
    setupEventListeners();
    if (creditsDisplay) {
      bootstrapTooltip = new bootstrap.Tooltip(creditsDisplay);
    }
    await Promise.all([
      loadConversations(),
      fetchAndRenderModels(),
      fetchAndDisplayUserCredits(),
    ]);

    renderChatHistory();
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
            metadata: msg.metadata,
          })),
        };
      });

      // Si no hay conversaciones cargadas desde la DB, asegurar que no haya un chat actual
      if (Object.keys(conversations).length === 0) {
        currentChatId = null;
        chatArea.classList.remove("chat-started");
      } else {
        // Si hay conversaciones, asegurar que haya un chat actual válido
        if (!currentChatId || !conversations[currentChatId]) {
          const latestChatId = Object.keys(conversations).sort(
            (a, b) => b - a
          )[0];
        }
      }
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
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

// EN: script.js
// REEMPLAZA TU FUNCIÓN addMessageToUI CON ESTA VERSIÓN COMPLETA

/**
 * Añade un mensaje a la interfaz del chat.
 * @param {string} sender - El rol del remitente ('user' o 'assistant').
 * @param {string} text - El contenido del mensaje en Markdown.
 * @param {number} messageIndex - El índice del mensaje en la conversación.
 * @param {Object} rawData - Datos brutos de la respuesta de la API (solo para 'assistant' messages).
 */
const addMessageToUI = (sender, text, messageIndex, rawData = null) => {
    // 1. Clonar la plantilla adecuada (mejor rendimiento)
    const templateId = sender === 'user' ? 'user-message-template' : 'bot-message-template';
    const template = document.getElementById(templateId);
    if (!template) {
        console.error(`Error: Plantilla '${templateId}' no encontrada.`);
        return;
    }
    const wrapper = template.content.cloneNode(true).firstElementChild;
    wrapper.dataset.index = messageIndex; // Establecer el índice del mensaje

    const messageDiv = wrapper.querySelector(".message");

    // 2. Configurar Marked.js para el resaltado de sintaxis
    marked.setOptions({
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : "plaintext";
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: "language-",
        breaks: true, // Habilitar saltos de línea con Markdown
    });

    // Renderizar el contenido Markdown
    messageDiv.innerHTML = marked.parse(text);

    // 3. Lógica para añadir cabeceras y botones a los bloques de código (para copiar/descargar)
    const codeBlocksInMessage = messageDiv.querySelectorAll('pre code');
    codeBlocksInMessage.forEach(codeElement => {
        const preElement = codeElement.parentElement; // El elemento <pre> padre del <code>

        // Saltar si este bloque de código ya está dentro del json-response-container,
        // o si ya tiene una cabecera delante (para evitar duplicados si el DOM se regenera).
        if (preElement.closest('.json-response-container') || preElement.previousElementSibling?.classList.contains('code-header')) {
            return;
        }

        // Determinar el lenguaje para mostrarlo en la cabecera
        const languageMatch = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
        const language = languageMatch ? languageMatch.substring('language-'.length) : 'plaintext';
        const displayLanguage = language === 'plaintext' ? 'Texto Plano' : language.charAt(0).toUpperCase() + language.slice(1); // Capitalizar

        // Crear el nuevo contenedor para el bloque de código completo (wrapper para pre y header)
        const codeBlockWrapper = document.createElement('div');
        codeBlockWrapper.classList.add('code-block'); // Reutilizamos la clase CSS para el estilo del bloque

        // Crear la cabecera del bloque de código
        const codeHeader = document.createElement('div');
        codeHeader.classList.add('code-header'); // Reutilizamos la clase CSS para el estilo de la cabecera
        codeHeader.innerHTML = `
            <span>${displayLanguage}</span>
            <div class="code-actions">
                <button class="action-btn copy-code-btn" title="Copiar código"><i class="bi bi-clipboard"></i></button>
                <button class="action-btn download-code-btn" title="Descargar código"><i class="bi bi-download"></i></button>
            </div>
        `;
        
        // Insertar la cabecera y el <pre> clonado dentro de nuestro nuevo wrapper
        codeBlockWrapper.appendChild(codeHeader);
        // Clonamos el <pre> completo para mantener sus listeners (si los tuviera, aunque aquí no los hay)
        codeBlockWrapper.appendChild(preElement.cloneNode(true)); 

        // Reemplazar el <pre> original en el DOM por nuestro nuevo codeBlockWrapper
        preElement.replaceWith(codeBlockWrapper);
    });

    // 4. Lógica específica para mensajes del asistente
    if (sender === "assistant") {
        // Actualizar el nombre del modelo en la cabecera
        const modelNameTag = wrapper.querySelector('.model-name-tag');
        if (modelNameTag) {
            if (rawData && rawData.model) {
                modelNameTag.textContent = rawData.model;
            } else {
                modelNameTag.remove(); // Quitar el span si no hay nombre de modelo
            }
        }

        // Actualizar estadísticas del footer (tiempo, tokens de entrada/salida/total)
        const statsContainer = wrapper.querySelector('.message-stats');
        if (statsContainer) {
            if (rawData && rawData.usage) {
                // Cálculo del tiempo transcurrido (si rawData.created está disponible)
                const time = rawData.created ? ((new Date().getTime() / 1000) - rawData.created).toFixed(2) : 'N/A';
                statsContainer.innerHTML = `
                    <span><i class="bi bi-clock"></i> ${time}s</span>
                    <span><i class="bi bi-box-arrow-in-down"></i> In: ${rawData.usage.prompt_tokens}</span>
                    <span><i class="bi bi-box-arrow-up"></i> Out: ${rawData.usage.completion_tokens}</span>
                    <span><i class="bi bi-hash"></i> Total: ${rawData.usage.total_tokens}</span>
                `;
            } else {
                statsContainer.innerHTML = '<span><i class="bi bi-info-circle"></i> Stats no disponibles</span>';
            }
        }

        // Lógica para el contenedor de JSON (oculto por defecto)
        const jsonContainer = wrapper.querySelector(".json-response-container");
        if (jsonContainer) {
            // Solo creamos el contenido JSON si rawData existe y no es un mensaje de error
            if (rawData && !rawData.errorType) {
                 jsonContainer.innerHTML = `
                    <div class="code-block">
                        <div class="code-header">
                            <span>JSON Response</span>
                            <button class="action-btn copy-code-btn" title="Copiar JSON"><i class="bi bi-clipboard"></i></button>
                        </div>
                        <pre><code class="language-json">${JSON.stringify(rawData, null, 2)}</code></pre>
                    </div>
                `;
                // Resaltar el código JSON después de insertarlo
                const jsonCodeBlock = jsonContainer.querySelector("pre code.language-json");
                if (jsonCodeBlock) hljs.highlightElement(jsonCodeBlock);
            } else {
                jsonContainer.remove(); // Removemos el contenedor si no hay datos JSON válidos
                const showJsonButton = wrapper.querySelector('.show-json-btn');
                if (showJsonButton) showJsonButton.remove(); // Quitar el botón si no hay JSON
            }
        }
    }

    // 5. Añadir el mensaje al chatbox
    chatBox.appendChild(wrapper);

    // 6. Resaltar todos los bloques de código en el nuevo mensaje (incluyendo el JSON si existe)
    wrapper.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    
    // 7. Hacer scroll al final del chat
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
      const filteredModels = availableModels.filter((model) =>
        model.model_name.toLowerCase().includes(searchTerm)
      );
      displayFilteredModels(filteredModels, modelItemsContainer);
    });

    const displayFilteredModels = (models, container) => {
      container.innerHTML = "";
      // console.log(models)
      models.forEach(async (model) => {
        if (model.model_info.mode == "chat") {
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

  async function getAIResponse(messages, onChunk, onDone, onError) {
    // Asegurarnos de que el AbortController está inicializado
    if (!thinkingAbortController) {
      thinkingAbortController = new AbortController();
    }

    // --- PASO 1: Limpiar los mensajes para la API ---
    // La API solo espera las propiedades 'role' y 'content'.
    // Eliminamos cualquier 'metadata' u otras propiedades que hayamos añadido localmente.
    const cleanedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      // --- PASO 2: Realizar la petición fetch a la API de LiteLLM ---
      const response = await fetch(
        `${appSettings.liteLLMUrl}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${appSettings.apiKey}`,
          },
          // Usamos el signal para permitir la cancelación de la petición
          signal: thinkingAbortController.signal,
          body: JSON.stringify({
            model: appSettings.defaultModel,
            messages: cleanedMessages, // Usamos los mensajes limpios
            stream: true, // Solicitamos respuesta en streaming
          }),
        }
      );

      // Manejo de errores iniciales de la respuesta HTTP (ej: 401 Unauthorized, 400 Bad Request)
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            error: { message: "Error desconocido de la API." },
          }));
        // Lanzamos un error con un mensaje más específico de LiteLLM
        throw new Error(
          `litellm.APIError: ${errorData.error.message || response.statusText}`
        );
      }

      // --- PASO 3: Leer y procesar el stream ---
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponseText = ""; // Acumula el texto completo de la respuesta
      let finalData = {}; // Guarda los metadatos de la última parte del stream (uso, modelo, etc.)
      let buffer = ""; // Buffer para reconstruir chunks JSON incompletos

      while (true) {
        const { value, done } = await reader.read(); // Lee el siguiente chunk del stream
        if (done) {
          // El stream ha terminado limpiamente (sin un [DONE] explícito de la API)
          if (buffer.trim()) {
            console.warn(
              "Stream finalizado con datos restantes en el buffer (posiblemente incompletos):",
              buffer
            );
          }
          break;
        }

        // Añadimos el nuevo chunk decodificado al buffer
        buffer += decoder.decode(value, { stream: true });

        // Dividimos el buffer por el separador de mensajes SSE (`\n\n`)
        // El último elemento puede ser un mensaje incompleto, así que lo guardamos para la próxima iteración
        const messageParts = buffer.split("\n\n");
        buffer = messageParts.pop() || "";

        // Procesamos cada parte que se ha identificado como un mensaje completo
        for (const part of messageParts) {
          if (!part.trim().startsWith("data: ")) {
            continue; // Ignorar líneas que no son datos de evento
          }

          const dataStr = part.replace("data: ", "").trim();

          if (dataStr === "[DONE]") {
            // La API ha enviado el marcador de fin del stream
            onDone(fullResponseText, finalData); // Llamamos al callback de finalización
            return; // Terminamos la función
          }

          try {
            const parsedData = JSON.parse(dataStr); // Intentamos parsear el JSON
            finalData = parsedData; // Actualizamos los metadatos finales

            // Extraemos el contenido del mensaje (si existe)
            const content = parsedData.choices[0]?.delta?.content || "";
            if (content) {
              fullResponseText += content; // Acumulamos el texto
              onChunk(content); // Notificamos a la UI del nuevo trozo
            }
          } catch (e) {
            console.error(
              "Error al parsear un chunk del stream (reconstruido):",
              dataStr,
              e
            );
            // No llamamos a onError aquí para no interrumpir el stream por un mal chunk.
            // El error general se captura al final si el stream no termina correctamente.
          }
        }
      }
      // Si el bucle termina porque `done` es true y no se encontró un `[DONE]` explícito,
      // todavía debemos llamar a onDone para finalizar la operación.
      onDone(fullResponseText, finalData);
    } catch (error) {
      // --- PASO 4: Manejar errores generales de la petición o interrupción ---
      // Si la petición fue abortada por el usuario (ej: nueva conversación), no hacemos nada
      if (error.name !== "AbortError") {
        console.error("Error durante la petición de streaming:", error);
        onError(error); // Notificamos a la UI del error
      }
    }
  }

  const handleFormSubmit = async () => {
    const messageContent = userInput.value.trim();
    if (!messageContent || chatForm.classList.contains("is-loading")) return;

    chatForm.classList.add("is-loading");
    userInput.disabled = true;
    thinkingAbortController = new AbortController();
    userInput.value = "";
    userInput.style.height = "auto";

    try {
      if (currentChatId === null) {
        const response = await fetch("/chat/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: messageContent.substring(0, 40) + "...",
          }),
        });
        const newConversation = await response.json();
        currentChatId = newConversation.id;
        conversations[currentChatId] = {
          id: newConversation.id,
          title: newConversation.title,
          messages: [],
        };
        renderChatHistory();
      }

      const userMessage = { role: "user", content: messageContent };
      conversations[currentChatId].messages.push(userMessage);
      displayConversation(currentChatId);
      await saveMessageToDB(currentChatId, "user", messageContent, {
        model: appSettings.defaultModel,
        date: Date.now(),
      });
      chatBox.scrollTop = chatBox.scrollHeight;

      addMessageToUI(
        "assistant",
        "",
        conversations[currentChatId].messages.length,
        null
      );

      // ======================= INICIO DE LA CORRECCIÓN =======================
      // Buscamos el elemento con la clase correcta: .assistant en lugar de .bot
      const assistantMessageWrappers = chatBox.querySelectorAll(
        ".message-wrapper.assistant"
      );
      const lastAssistantMessageWrapper =
        assistantMessageWrappers[assistantMessageWrappers.length - 1];
      const messageDivToUpdate =
        lastAssistantMessageWrapper.querySelector(".message");
      // ======================== FIN DE LA CORRECCIÓN =========================

      let accumulatedResponse = "";

      await getAIResponse(
        conversations[currentChatId].messages,

        (chunk) => {
          accumulatedResponse += chunk;
          messageDivToUpdate.innerHTML = marked.parse(
            accumulatedResponse + " ▌"
          );
          chatBox.scrollTop = chatBox.scrollHeight;
        },

        async (fullText, finalData) => {
          messageDivToUpdate.innerHTML = marked.parse(fullText);
          lastAssistantMessageWrapper
            .querySelectorAll("pre code")
            .forEach((block) => hljs.highlightElement(block));

          await saveMessageToDB(
            currentChatId,
            "assistant",
            fullText,
            finalData
          );

          conversations[currentChatId].messages.push({
            role: "assistant",
            content: fullText,
            metadata: finalData,
          });

          if (conversations[currentChatId].messages.length === 2) {
            const newTitle = fullText.substring(0, 40) + "...";
            conversations[currentChatId].title = newTitle;
            renderChatHistory();
            await fetch(`/chat/conversation/${currentChatId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: newTitle }),
            });
          }

          displayConversation(currentChatId);
          fetchAndDisplayUserCredits();
        },

        (error) => {
          messageDivToUpdate.innerHTML = `<div class="alert alert-danger"><strong>Error:</strong> ${error.message}</div>`;
        }
      );
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
    } finally {
      chatForm.classList.remove("is-loading");
      userInput.disabled = false;
      userInput.focus();
    }
  };
  const fetchAndDisplayUserCredits = async () => {
    // 1. Verificaciones iniciales para asegurar que tenemos todo lo necesario
    if (!creditsCounter || !appSettings.liteLLMUrl || !appSettings.apiKey) {
      if (creditsCounter) creditsCounter.textContent = "Configure URL/Key";
      return;
    }

    try {
      // 2. Hacemos la llamada a la API que ya confirmamos que funciona (con GET)
      const response = await fetch(`${appSettings.liteLLMUrl}/key/info`, {
        headers: {
          Authorization: `Bearer ${appSettings.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      // 3. Manejo de errores de conexión o autenticación
      if (!response.ok) {
        console.error("Error de API al obtener créditos:", response.status);
        creditsCounter.textContent = "Créditos no disponibles";
        return;
      }

      // 4. Procesamos el JSON que nos devuelve la API
      const keyInfo = await response.json();
      // console.log(appSettings.apiKey)
      // console.log(keyInfo)
      // 5. Verificamos que la respuesta tenga la estructura esperada
      if (!keyInfo || !keyInfo.info) {
        creditsCounter.textContent = "Respuesta de API inválida";
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
        const spendFormatted = spend.toLocaleString("es-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 4,
        });
        creditsCounter.textContent = `Gasto: ${spendFormatted}`;

        const tooltipText = `Gasto Total: ${spendFormatted}\n(Sin presupuesto máximo definido)`;
        if (bootstrapTooltip) {
          bootstrapTooltip.setContent({ ".tooltip-inner": tooltipText });
        } else {
          creditsDisplay.setAttribute("title", tooltipText);
        }
        return; // Salimos de la función aquí
      }

      // CASO 2: Sí hay un presupuesto máximo definido
      const remainingBudget = maxBudget - spend;
      creditsCounter.textContent = `Disponible: ${remainingBudget.toLocaleString(
        "es-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 4 }
      )}`;

      // Función interna para formatear fechas
      const formatToFriendlyDate = (isoString) => {
        if (!isoString) return "No definida";
        return new Date(isoString).toLocaleString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      // Construcción del tooltip detallado
      const tooltipDetails = [
        `Presupuesto Máximo: ${maxBudget.toLocaleString("es-US", {
          style: "currency",
          currency: "USD",
        })}`,
        `Gasto Actual: ${spend.toLocaleString("es-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 4,
        })}`,
        "---",
        `Clave Creada: ${formatToFriendlyDate(createdAtISO)}`,
        `Última Actualización: ${formatToFriendlyDate(updatedAtISO)}`,
      ];

      const finalTooltipText = tooltipDetails.join("\n");

      // Actualización del tooltip
      if (bootstrapTooltip) {
        bootstrapTooltip.setContent({ ".tooltip-inner": finalTooltipText });
      } else {
        creditsDisplay.setAttribute("title", finalTooltipText);
      }
    } catch (error) {
      console.error("Error de red al obtener créditos:", error);
      creditsCounter.textContent = "Error al cargar";
      const errorText = "No se pudo conectar para obtener los créditos.";
      if (bootstrapTooltip)
        bootstrapTooltip.setContent({ ".tooltip-inner": errorText });
      else creditsDisplay.setAttribute("title", errorText);
    }
  };

  // =================================================================================
  //  6. EVENT LISTENERS (FUNCIÓN COMPLETA Y CORREGIDA)
  // =================================================================================
function setupEventListeners() {
    // ======================================
    // 1. Sidebar y Nueva Conversación
    // ======================================
    sidebarToggle.addEventListener("click", () => {
        // En móvil (ej: < 768px), usamos una clase 'visible' para posición fija
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle("visible");
            // Aquí podrías añadir un overlay oscuro para bloquear el fondo si lo deseas
        } else {
            // En escritorio, usamos 'hidden' para el margen negativo
            sidebar.classList.toggle("hidden");
        }
    });

    newChatBtn.addEventListener("click", startNewChat);

    // ======================================
    // 2. Formulario de Chat (Input)
    // ======================================
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // Lógica para ajustar la altura del textarea automáticamente
    if (userInput) {
        const adjustTextareaHeight = () => {
            userInput.style.height = "auto";
            userInput.style.height = userInput.scrollHeight + "px";
        };
        userInput.addEventListener("input", adjustTextareaHeight);
        adjustTextareaHeight(); // Ajustar altura al cargar

        // Lógica para enviar el mensaje al presionar Ctrl + Enter
        userInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault(); // Evita que se añada una nueva línea
                if (userInput.value.trim() !== "") {
                    handleFormSubmit();
                }
            }
        });
    }

    // ======================================
    // 3. Historial de Chats (Delegación de Eventos)
    // ======================================
    chatHistory.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest(".delete-chat-btn");
        const link = e.target.closest(".nav-link");

        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation(); // Evita que el clic se propague al enlace padre

            const chatIdToDelete = parseInt(deleteBtn.dataset.chatId, 10);
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
                            position: "top-end",
                            icon: "success",
                            title: "Chat eliminado",
                            showConfirmButton: false,
                            timer: 2000,
                            theme: "dark",
                        });
                    } catch (error) {
                        console.error("Error al eliminar chat:", error);
                        Swal.fire("Error!", "No se pudo eliminar el chat.", "error");
                    }
                }
            });
        } else if (link) {
            e.preventDefault();
            if (thinkingAbortController) {
                thinkingAbortController.abort(); // Cancela cualquier petición en curso
                thinkingAbortController = null;
            }
            const chatIdToDisplay = parseInt(link.dataset.chatId, 10);
            displayConversation(chatIdToDisplay);
        }
    });

    // ======================================
    // 4. Acciones en los Mensajes (Delegación de Eventos)
    // ======================================
    chatBox.addEventListener("click", (e) => {
        // --- Acciones del footer del mensaje (copiar mensaje completo, leer, mostrar JSON) ---
        const actionBtn = e.target.closest(".action-btn");
        if (actionBtn && actionBtn.dataset.action) {
            const wrapper = e.target.closest(".message-wrapper");
            if (!wrapper) return; // Asegurarse de que estamos dentro de un mensaje

            const messageDiv = wrapper.querySelector(".message");
            const action = actionBtn.dataset.action;

            if (action === "copy") {
                navigator.clipboard.writeText(messageDiv.innerText);
                Swal.fire({toast: true, position: "top-end", icon: "success", title: "Mensaje Copiado!", showConfirmButton: false, timer: 1000, theme: "dark"});
            } else if (action === "speak") {
                const utterance = new SpeechSynthesisUtterance(messageDiv.innerText);
                speechSynthesis.speak(utterance);
            } else if (action === "show-json-btn") {
                const jsonContainer = wrapper.querySelector(".json-response-container");
                if (jsonContainer) {
                    jsonContainer.style.display = jsonContainer.style.display === "block" ? "none" : "block";
                }
            }
        } 
        // --- Acciones específicas para bloques de código (copiar, descargar) ---
        else if (e.target.closest(".copy-code-btn")) {
            const copyButton = e.target.closest(".copy-code-btn");
            const codeElement = copyButton.closest('.code-block').querySelector('pre code');
            if (codeElement) {
                navigator.clipboard.writeText(codeElement.innerText);
                Swal.fire({toast: true, position: "top-end", icon: "success", title: "Código Copiado!", showConfirmButton: false, timer: 1000, theme: "dark"});
            }
        } else if (e.target.closest(".download-code-btn")) {
            const downloadButton = e.target.closest(".download-code-btn");
            const codeElement = downloadButton.closest('.code-block').querySelector('pre code');
            if (codeElement) {
                const codeContent = codeElement.innerText;
                const headerSpan = downloadButton.closest('.code-header').querySelector('span');
                let language = 'txt'; // Extensión por defecto
                if (headerSpan) {
                    const headerText = headerSpan.textContent.trim().toLowerCase();
                    // Mapeo simple de nombres a extensiones comunes
                    const langMap = {
                        'python': 'py', 'javascript': 'js', 'json': 'json', 'html': 'html', 'css': 'css',
                        'bash': 'sh', 'markdown': 'md', 'xml': 'xml', 'yaml': 'yml', 'sql': 'sql'
                    };
                    language = langMap[headerText] || 'txt';
                }

                const filename = `code_snippet.${language}`;
                const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url); // Liberar la URL del objeto
                
                Swal.fire({toast: true, position: "top-end", icon: "success", title: "Descargando Código!", showConfirmButton: false, timer: 1000, theme: "dark"});
            }
        }
    });

    // ======================================
    // 5. Menú de Subida de Archivos
    // ======================================
    uploadBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que el clic se propague al document y cierre el menú
        uploadMenu.style.display = uploadMenu.style.display === "block" ? "none" : "block";
    });
    // Cerrar menú de subida y popover de modelo al hacer clic fuera
    document.addEventListener("click", () => {
        uploadMenu.style.display = "none";
        modelPopover.style.display = "none";
    });
    uploadMenu.addEventListener("click", (e) => {
        e.preventDefault();
        const action = e.target.closest(".upload-item")?.dataset.action;
        if (action) {
            // Aquí podrías añadir lógica para diferentes tipos de subida si `fileInput` lo permitiera
            // Por ahora, solo abre el selector de archivos
            fileInput.click();
        }
        uploadMenu.style.display = "none";
    });

    // ======================================
    // 6. Selector de Modelos
    // ======================================
    modelSelectorBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que el clic se propague al document y cierre el popover
        modelPopover.style.display = modelPopover.style.display === "block" ? "none" : "block";
        const modelSearchInput = document.getElementById("model-search-input");
        if (modelSearchInput) {
            modelSearchInput.focus(); // Pone el foco en el campo de búsqueda al abrir
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
            // Si tienes un select de modelo en el modal de configuración, actualízalo también
            const defaultModelSelect = document.getElementById("default-model-select");
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

    // ======================================
    // 7. Modal de Configuración
    // ======================================
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", saveSettings);
    }
}

  // --- INICIALIZACIÓN ---
  initialize();
});
