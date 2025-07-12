## 4. Esquema de Base de Datos para Producción (PostgreSQL)

Para la transición del prototipo a un producto real, se ha diseñado un esquema de base de datos relacional robusto.

*   **`users`**: Almacena credenciales y datos de perfil.
*   **`subscription_plans`**: Define los tiers de suscripción y sus límites.
*   **`user_subscriptions`**: Vincula usuarios a planes y gestiona el estado del pago.
*   **`conversations`**: Guarda la metadata de cada chat.
*   **`messages`**: Almacena cada mensaje individual de una conversación.
*   **`documents`**: Metadatos de los archivos subidos por el usuario para RAG.
*   **`document_chunks`**: Trozos de texto de los documentos con sus `embeddings` vectoriales (`vector(1536)`) para búsqueda semántica, utilizando la extensión **`pgvector`**.

---

## 5. Próximos Pasos: Hacia la Producción

El prototipo ha validado con éxito la visión, la funcionalidad principal y la experiencia de usuario. El siguiente paso lógico es migrar de este prototipo a una aplicación de producción escalable.

**El próximo gran hito es:** **Crear el sistema de Login y Registro.**

### Tareas Inmediatas:
1.  **Elegir un Framework de Frontend:** Migrar la lógica del prototipo a un framework moderno como **Next.js**. Esto nos proporcionará:
    *   Renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG) para un rendimiento y SEO óptimos.
    *   Un sistema de enrutamiento basado en archivos.
    *   API Routes para crear un backend seguro (BFF - Backend For Frontend) que gestione la lógica de negocio.
2.  **Implementar la Autenticación:**
    *   Crear las páginas de Registro (`/register`) y Login (`/login`).
    *   Desarrollar la lógica en el backend (API Routes de Next.js) para:
        *   Hashear y guardar las contraseñas de forma segura en la tabla `users` de PostgreSQL.
        *   Verificar credenciales y emitir tokens de sesión (ej. JWT o usar una librería como `NextAuth.js`).
    *   Crear rutas protegidas que solo sean accesibles para usuarios autenticados.
3.  **Conectar con la Base de Datos:**
    *   Reemplazar el uso de `localStorage` con llamadas a nuestro backend, que a su vez interactuará con la base de datos PostgreSQL para guardar y recuperar conversaciones, mensajes y configuraciones de usuario.

Una vez completado el sistema de autenticación, Kipux AI dejará de ser un prototipo y se convertirá en la base de un verdadero producto SaaS multiusuario.