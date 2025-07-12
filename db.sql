-- =================================================================
--  TABLA DE USUARIOS (Users)
--  Almacena la información principal de cada usuario.
-- =================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Usar UUID es mejor para IDs públicos.
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- NUNCA guardar contraseñas en texto plano.
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp
);

COMMENT ON TABLE users IS 'Tabla principal para almacenar los datos de los usuarios registrados.';
COMMENT ON COLUMN users.password_hash IS 'Hash de la contraseña, generado con un algoritmo seguro como bcrypt o Argon2.';


-- =================================================================
--  TABLA DE PLANES DE SUSCRIPCIÓN (SubscriptionPlans)
--  Define los diferentes tiers que ofreces (10$, 30$, etc.).
-- =================================================================

CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Ej. "Básico", "Pro", "Experto"
    price_monthly NUMERIC(10, 2) NOT NULL, -- Ej. 10.00, 30.00
    message_limit INT, -- Límite de mensajes por día/mes. NULL para ilimitado.
    allow_web_search BOOLEAN DEFAULT false,
    allow_rag BOOLEAN DEFAULT false, -- RAG = Retrieval-Augmented Generation (subir documentos)
    max_storage_mb INT DEFAULT 0, -- Almacenamiento para documentos RAG en MB.
    description TEXT
);

COMMENT ON TABLE subscription_plans IS 'Define los diferentes niveles de suscripción disponibles.';


-- =================================================================
--  TABLA DE SUSCRIPCIONES DE USUARIOS (UserSubscriptions)
--  Vincula a un usuario con un plan y gestiona su estado.
-- =================================================================

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused')), -- Estado actual de la suscripción
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    -- ID de la suscripción en el proveedor de pagos (Stripe, WooCommerce Subscriptions, etc.)
    external_subscription_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp
);

COMMENT ON TABLE user_subscriptions IS 'Registra la suscripción activa de cada usuario a un plan.';
COMMENT ON COLUMN user_subscriptions.status IS 'Controlado por webhooks desde la pasarela de pago.';


-- =================================================================
--  TABLA DE CONVERSACIONES (Conversations)
--  Almacena la metadata de cada chat.
-- =================================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Nuevo Chat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp -- Se actualiza con cada nuevo mensaje.
);

COMMENT ON TABLE conversations IS 'Contiene una conversación o chat. El título se toma del primer prompt.';


-- =================================================================
--  TABLA DE MENSAJES (Messages)
--  Almacena cada mensaje individual de una conversación.
-- =================================================================

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY, -- Usar un entero grande para el orden es eficiente.
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')), -- O 'system' si se necesita
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp
);

-- Un índice para recuperar rápidamente los mensajes de una conversación en orden.
CREATE INDEX idx_messages_on_conversation_id_and_created_at ON messages(conversation_id, created_at ASC);

COMMENT ON TABLE messages IS 'Almacena cada mensaje individual (del usuario o de la IA) dentro de una conversación.';


-- =================================================================
--  TABLA DE DOCUMENTOS (Documents) - Para RAG
--  Almacena la metadata de los archivos que suben los usuarios.
-- =================================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    storage_path VARCHAR(1024) NOT NULL, -- Ruta en S3, MinIO o almacenamiento local.
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp
);

COMMENT ON TABLE documents IS 'Metadatos de los archivos subidos por los usuarios para RAG.';


-- =================================================================
--  TABLA DE TROZOS DE DOCUMENTO (DocumentChunks) - Para RAG con pgvector
--  Almacena los "trozos" (chunks) de cada documento con su vector.
-- =================================================================

CREATE TABLE document_chunks (
    id BIGSERIAL PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    -- ¡La columna mágica! Almacena el embedding del chunk.
    -- 1536 es la dimensionalidad del modelo text-embedding-ada-002 de OpenAI. Ajustar si usas otro.
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT aiohttp
);

-- Índice HNSW (Hierarchical Navigable Small World) para búsquedas de similitud ultra rápidas.
CREATE INDEX idx_document_chunks_on_embedding ON document_chunks USING hnsw (embedding vector_l2_ops);

COMMENT ON TABLE document_chunks IS 'Almacena trozos de texto de documentos y sus correspondientes embeddings vectoriales para búsqueda semántica.';