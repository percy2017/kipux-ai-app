# Plan de Desarrollo de Kipux AI

Este documento detalla las funcionalidades implementadas en la aplicación y los próximos pasos a seguir.

---

## ✅ Funcionalidades Implementadas

### 1. Gestión de Perfil de Usuario

Se ha implementado un sistema completo para que los usuarios puedan gestionar los datos de su perfil directamente desde la interfaz de chat.

#### 1.1. Frontend (`views/chat.ejs`)

*   **Pestaña "Perfil"**: Se ha añadido una nueva pestaña con el ícono `bi-person-badge` al modal de "Configuración".
*   **Formulario de Perfil**: Dentro de esta pestaña, se ha creado un formulario (`#profile-form`) con los siguientes campos:
    *   **Nombre**: Un campo de texto (`#profile-name`) que permite al usuario cambiar su nombre de visualización. Se precarga con el nombre actual del usuario.
    *   **Correo Electrónico**: Un campo de solo lectura (`#profile-email`) que muestra el email del usuario, el cual no se puede modificar.
    *   **Nueva Contraseña**: Un campo de contraseña (`#profile-password`) para que el usuario pueda establecer una nueva contraseña. Es opcional; si se deja en blanco, la contraseña actual no se modifica.
*   **Envío del Formulario**: El formulario está configurado con `action="/profile"` y `method="post"` para ser enviado al backend.

#### 1.2. Backend - Ruta (`routes/auth.routes.js`)

*   **Nueva Ruta `POST /profile`**: Se ha añadido una nueva ruta para gestionar la actualización del perfil.
*   **Middleware de Autenticación**: La ruta está protegida por el middleware `isAuthenticated`, asegurando que solo los usuarios autenticados puedan actualizar su perfil.

#### 1.3. Backend - Controlador (`controllers/auth.controller.js`)

*   **Función `updateUser`**: Se ha creado una nueva función asíncrona que maneja la lógica de actualización:
    1.  **Recepción de Datos**: Obtiene el `name` y `password` del `req.body`.
    2.  **Actualización Condicional**:
        *   El `name` se incluye siempre en los datos a actualizar.
        *   Si se proporciona una `password`, se hashea usando `bcrypt.hash()` antes de añadirla a los datos de actualización.
    3.  **Interacción con la Base de Datos**: Utiliza `prisma.user.update()` para guardar los cambios en la base de datos, buscando al usuario por el `id` almacenado en la sesión.
    4.  **Actualización de la Sesión**: Tras una actualización exitosa, el nombre del usuario en `req.session.user` se actualiza con el nuevo valor para que el cambio se refleje inmediatamente en la UI.
    5.  **Redirección**: El usuario es redirigido de vuelta a la página `/chat`.

#### 1.4. Frontend - Lógica (`public/javascripts/script.js`)

*   **Manejo del Botón "Guardar Cambios"**: La función `saveSettings` ha sido mejorada:
    *   Ahora comprueba cuál es la pestaña activa dentro del modal de configuración.
    *   Si la pestaña activa es "Perfil" (`#v-pills-profile`), en lugar de ejecutar la lógica de guardado de configuración, invoca el método `submit()` sobre el formulario `#profile-form`, delegando el proceso al backend.

---

### 2. Persistencia de Configuración de Usuario en Base de Datos

Se ha refactorizado la aplicación para que la configuración del usuario (API Key, URL de LiteLLM, tema, etc.) se guarde de forma persistente en la base de datos, eliminando el uso de `localStorage` para este propósito.

#### 2.1. Base de Datos (`prisma/schema.prisma`)

*   **Ampliación del Modelo `User`**: Se han añadido nuevos campos al modelo `User` para almacenar la configuración:
    *   `apiKey` (String, opcional)
    *   `liteLLMUrl` (String, opcional)
    *   `theme` (String, opcional, con valor por defecto "system")
    *   `defaultModel` (String, opcional, con valor por defecto "gpt-4o-mini")
*   **Migración**: Se ha creado y aplicado una nueva migración de base de datos (`npx prisma migrate dev --name add_user_settings`) para reflejar estos cambios en la tabla `User`.

#### 2.2. Backend - Ruta (`routes/auth.routes.js`)

*   **Nueva Ruta `PUT /user/settings`**: Se ha añadido una nueva ruta para que el frontend pueda enviar la configuración actualizada.
*   **Middleware de Autenticación**: La ruta está protegida por el middleware `isAuthenticated` para asegurar que solo el usuario logueado pueda modificar su propia configuración.

#### 2.3. Backend - Controlador (`controllers/auth.controller.js`)

*   **Nueva Función `updateUserSettings`**: Se ha implementado una función asíncrona que:
    1.  Obtiene el ID del usuario de la sesión (`req.session.user.id`).
    2.  Recibe los datos de configuración (`apiKey`, `liteLLMUrl`, `theme`, `defaultModel`) desde el `req.body`.
    3.  Utiliza `prisma.user.update()` para guardar estos nuevos valores en el registro del usuario correspondiente.
    4.  Responde con un JSON de éxito (`{ message: 'Settings updated successfully' }`) o de error.

#### 2.4. Frontend - Vista (`views/chat.ejs`)

*   **Inyección de Datos del Servidor**: Para que el frontend conozca la configuración guardada en la base de datos al cargar la página, se ha añadido un bloque `<script>` que crea un objeto global `serverData`.
*   **Objeto `serverData`**: Este objeto contiene la configuración del usuario (`userSettings`), que se rellena con los datos del usuario logueado pasados desde el controlador de la ruta `/chat`. Esto evita la necesidad de una llamada AJAX inicial para obtener la configuración.
*   **Ajustes en la UI**: Se ha cambiado la etiqueta de la pestaña "Cuenta" a "Conexión" y se ha ocultado la pestaña "Modelo" para simplificar la interfaz.

#### 2.5. Frontend - Lógica (`public/javascripts/script.js`)

*   **`loadSettings`**: Esta función ya no lee de `localStorage`. En su lugar, inicializa el estado `appSettings` directamente desde el objeto `serverData.userSettings` inyectado en el HTML.
*   **`saveSettings`**: Esta función ha sido completamente reescrita:
    *   Ya no guarda en `localStorage`.
    *   Recopila los valores de los campos de configuración del modal.
    *   Realiza una petición `PUT` a la nueva ruta `/user/settings` con los datos en formato JSON.
    *   Tras una respuesta exitosa, actualiza el estado local `appSettings` y aplica los cambios necesarios (ej. tema, recarga de modelos).

#### 2.6. Corrección de Errores (Debugging)

*   Durante la implementación, surgieron errores de tipo `TypeError` en el frontend debido a que el JavaScript intentaba acceder a elementos del DOM que habían sido eliminados (como el selector de modelo por defecto en el modal).
*   **Solución**: Se han añadido comprobaciones de nulidad (`if (element) { ... }`) en el código JavaScript (`public/javascripts/script.js`) para asegurar que solo se intente acceder a las propiedades de los elementos si estos existen en la página, haciendo el código más robusto y evitando fallos en tiempo de ejecución.

---

## 🚀 Próximos Pasos

*   **Implementar la lógica de chat con Socket.IO** para una comunicación en tiempo real.
*   **Desarrollar la capacidad de "subir documentos" (RAG)**.
*   **Mejorar la gestión de errores y notificaciones** en la interfaz.
