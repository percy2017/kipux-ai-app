# Titulo y Descripcion
Kipux AI app, pagina web para un chatbot con IA, utilizando varios modelos de varios proveedores, desde liteLLM

¡Claro que sí! Aquí tienes un resumen completo del estado y las funcionalidades de tu aplicativo, en formato Markdown (`.md`).

---

# Resumen del Chatbot Kipux AI

Este documento resume las principales características, las funcionalidades implementadas, y el estado actual del aplicativo Chatbot "Kipux AI" desarrollado con HTML, CSS, JavaScript (frontend) y Node.js/Express (backend).

## 1. Arquitectura y Tecnologías Base

*   **Frontend:**
    *   **HTML (EJS):** Estructura principal de la interfaz de usuario, con templating para inyección de datos del servidor (ej. información de usuario, configuración inicial).
    *   **CSS:** Estilos personalizados (`style.css`) utilizando variables CSS para un tema oscuro cohesivo y fácil de mantener. Integración con Bootstrap para componentes UI y un diseño responsivo.
    *   **JavaScript:** Lógica del cliente (`script.js`) para la interactividad, comunicación con la API, gestión del estado de la conversación y renderizado dinámico.
    *   **Librerías Clave:**
        *   `Marked.js`: Para renderizar contenido Markdown en HTML.
        *   `Highlight.js`: Para el resaltado de sintaxis en bloques de código.
        *   `Bootstrap 5`: Framework CSS para diseño y componentes.
        *   `Bootstrap Icons`: Para iconos visuales.
        *   `SweetAlert2`: Para notificaciones y diálogos amigables.
*   **Backend (Node.js/Express):**
    *   Manejo de rutas para la carga de conversaciones y el guardado de mensajes en una base de datos (se asume persistencia).
    *   Gestión de la autenticación/sesión de usuario (`user` data).

## 2. Funcionalidades Implementadas

El aplicativo cuenta con las siguientes características robustas:

### 2.1. Interfaz de Usuario y Experiencia (UX)

*   **Diseño Moderno y Adaptativo:**
    *   Tema oscuro consistente.
    *   **Diseño Responsivo:** Adaptado para pantallas grandes y pequeñas (móviles), con comportamiento dinámico de la barra lateral (sidebar) y ajuste de mensajes/input.
*   **Gestión de Conversaciones:**
    *   **Historial de Chats:** Visualización de conversaciones anteriores en la barra lateral.
    *   Creación de **Nuevos Chats**.
    *   Selección y **Visualización de Chats existentes**.
    *   **Eliminación de Chats** con confirmación.
    *   Títulos de chat dinámicos basados en el primer mensaje de usuario o la respuesta del asistente.
*   **Campo de Entrada Inteligente:**
    *   `Textarea` con **ajuste automático de altura**.
    *   Envío de mensajes con **`Ctrl + Enter` (o `Cmd + Enter`)**.
    *   **Indicador de Carga:** El formulario se deshabilita y atenúa visualmente mientras la IA está generando una respuesta.
    *   Menú de subida de archivos (UI implementada, la lógica de subida real aún no).
*   **Gestión de Modelos:**
    *   Selector de modelos dinámico que muestra los modelos disponibles desde la API de LiteLLM.
    *   Permite seleccionar un modelo por defecto para las conversaciones.
*   **Visualización de Créditos:** Muestra el presupuesto disponible del usuario, con un `tooltip` detallado sobre el gasto y el presupuesto máximo.
*   **Configuración Avanzada:** Modal de configuración para API Key de LiteLLM y URL del servidor.

### 2.2. Manejo y Renderizado de Contenido

*   **Renderizado de Markdown Completo:**
    *   Soporte para **negritas**, *cursivas*, enlaces, títulos (`#`, `##`, etc.).
    *   Citas en bloque (`>`).
    *   **Listas Ordenadas y No Ordenadas** (con estilos CSS para una correcta visualización).
    *   **Tablas Markdown** (con estilos CSS para bordes, padding y filas alternas, lo que las hace legibles).
*   **Bloques de Código Avanzados:**
    *   Detección automática del lenguaje de programación (Python, JavaScript, JSON, Bash, etc.).
    *   **Resaltado de Sintaxis** profesional cortesía de `Highlight.js`.
    *   **Cabeceras dinámicas** en cada bloque de código, mostrando el lenguaje.
    *   **Botón "Copiar"** para copiar rápidamente el contenido del bloque de código al portapapeles.
    *   **Botón "Descargar"** para guardar el código como un archivo (con extensión inferida del lenguaje).
*   **Visualización de Respuestas JSON:**
    *   Un botón específico para "Mostrar JSON" en los mensajes del asistente, revelando los metadatos brutos de la respuesta de la API en un bloque de código JSON con resaltado.

### 2.3. Comunicación con la IA y Persistencia

*   **Conexión con LiteLLM:** Actúa como un proxy flexible para interactuar con diversos modelos de lenguaje.
*   **¡Respuestas en Streaming!:** La característica más destacada. El bot muestra su respuesta **palabra por palabra** a medida que la recibe, mejorando drásticamente la percepción de velocidad y la experiencia del usuario. Esto se logra mediante un buffer robusto que reconstruye los chunks JSON incompletos del stream.
*   **Gestión de Conversaciones en Backend:**
    *   Las conversaciones y mensajes se guardan persistentemente en una base de datos.
    *   Se envía un historial de mensajes "limpio" (solo `role` y `content`) a la API para evitar errores de validación.
*   **Manejo de Errores de la API:**
    *   Capacidad para detectar y mostrar errores específicos de la API (ej. modelo no encontrado, errores internos del proveedor, problemas de clave API) de forma clara al usuario en la interfaz.
    *   **Los mensajes de error también se guardan en el historial de la conversación** para depuración y contexto del usuario.

## 3. Estado Actual del Aplicativo

El chatbot Kipux AI se encuentra en un estado **altamente funcional y robusto** para las características principales de interacción con modelos de lenguaje:

*   **Core Funcionalidad:** La comunicación bidireccional con la IA, el procesamiento de mensajes, la visualización en streaming y el guardado de historial son completamente operativos.
*   **Estabilidad:** El manejo del stream de datos y la gestión de errores de la API son sólidos, lo que significa que el aplicativo se recupera elegantemente de la mayoría de los problemas de comunicación externos.
*   **Experiencia de Usuario (UX):** Ha sido significativamente mejorada con el streaming, los botones de copiar/descargar, el estado de carga y la responsividad, ofreciendo una experiencia moderna y pulida.
*   **Preparación para Desarrollo Futuro:** La base de código está bien estructurada y las funciones están modularizadas, facilitando futuras adiciones y mantenimiento.

## 4. Próximos Pasos Sugeridos

Aunque el aplicativo es muy completo, siempre hay áreas para expandir:

*   **Implementar la funcionalidad de "Subir Archivo":** Actualmente, solo la interfaz para subir archivos está presente. El siguiente paso sería implementar la lógica de backend y frontend para procesar y enviar estos archivos a la IA (ej., para funcionalidades de multi-modalidad o RAG).
*   **Refinamiento de UX:** Explorar mejoras como indicadores de carga más detallados, opciones de voz a texto/texto a voz más avanzadas, o temas personalizables.
*   **Pruebas de Rendimiento y Escalabilidad:** Realizar pruebas de estrés para asegurar que la aplicación maneja un gran volumen de usuarios o conversaciones de forma eficiente.

---

## Herramientas y frameworks
- Bootstrap, intl-tel-input, highlight y Swalert2
- PostgreSQL, PGvector y redis
- Searxng y browserless

## estructura del directorio
```
kipux-ai-app
├─ 📁bin
│  └─ 📄www
├─ 📁controllers
│  ├─ 📄auth.controller.js
│  └─ 📄chat.controller.js
├─ 📁node_modules
├─ 📁prisma
│  ├─ 📁migrations
│  │  ├─ 📁20250712050116_create_user_table
│  │  │  └─ 📄migration.sql
│  │  ├─ 📁20250712071124_add_user_to_message
│  │  │  └─ 📄migration.sql
│  │  ├─ 📁20250712074938_add_user_settings
│  │  │  └─ 📄migration.sql
│  │  ├─ 📁20250712162454_add_metadata_to_message
│  │  │  └─ 📄migration.sql
│  │  └─ 📄migration_lock.toml
│  └─ 📄schema.prisma
├─ 📁public
│  ├─ 📁images
│  ├─ 📁javascripts
│  │  └─ 📄script.js
│  └─ 📁stylesheets
│     └─ 📄style.css
├─ 📁routes
│  ├─ 📄auth.routes.js
│  ├─ 📄chat.routes.js
│  └─ 📄index.routes.js
├─ 📁views
│  ├─ 📄chat.ejs
│  ├─ 📄error.ejs
│  ├─ 📄index.ejs
│  ├─ 📄login.ejs
│  └─ 📄register.ejs
├─ 📄.gitignore
├─ 📄app.js
├─ 📄package-lock.json
├─ 📄package.json
└─ 📄plan.md
```


## dependencias de nodejs
```json
{
  "name": "kipux-ai-app",
  "description": "pagina web para un chatbot con IA",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  "dependencies": {
    "@prisma/client": "^6.11.1",
    "bcryptjs": "^3.0.2",
    "connect-redis": "^9.0.0",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^17.2.0",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "express-session": "^1.18.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "node-fetch": "^3.3.2",
    "prisma": "^6.11.1",
    "redis": "^5.6.0",
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```