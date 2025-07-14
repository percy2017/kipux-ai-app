# Titulo y Descripcion
Kipux AI app, pagina web para un chatbot con IA, utilizando varios modelos de varios proveedores, desde liteLLM

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

## formato de list ade modelo
```json
[
    {
        "model_name": "llama3.3-70b",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "llmapi",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "llama3.3-70b"
        },
        "model_info": {
            "id": "20f4548a-f7a9-4d55-b184-9659ba06c189",
            "db_model": true
        }
    },
    {
        "model_name": "gemini/gemini-2.5-pro",
        "litellm_params": {
            "custom_llm_provider": "gemini",
            "litellm_credential_name": "google",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "gemini/gemini-2.5-pro"
        },
        "model_info": {
            "id": "50d5a246-0565-4cd5-8444-b120f154c791",
            "db_model": true,
            "key": "gemini/gemini-2.5-pro",
            "max_tokens": 65535,
            "max_input_tokens": 1048576,
            "max_output_tokens": 65535,
            "input_cost_per_token": 0.00000125,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": null,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": 0.0000025,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": null,
            "output_cost_per_token_batches": null,
            "output_cost_per_token": 0.00001,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": 0.000015,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "gemini",
            "mode": "chat",
            "supports_system_messages": true,
            "supports_response_schema": true,
            "supports_vision": true,
            "supports_function_calling": true,
            "supports_tool_choice": true,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": null,
            "supports_audio_input": true,
            "supports_audio_output": null,
            "supports_pdf_input": true,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": true,
            "supports_url_context": null,
            "supports_reasoning": true,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": 800000,
            "rpm": 2000,
            "supported_openai_params": [
                "temperature",
                "top_p",
                "max_tokens",
                "max_completion_tokens",
                "stream",
                "tools",
                "tool_choice",
                "functions",
                "response_format",
                "n",
                "stop",
                "logprobs",
                "frequency_penalty",
                "modalities",
                "parallel_tool_calls",
                "web_search_options",
                "reasoning_effort",
                "thinking"
            ]
        }
    },
    {
        "model_name": "gpt-image-1",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "openAI",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "gpt-image-1"
        },
        "model_info": {
            "id": "8d765b8b-43df-46d8-863f-3175e5c5b91b",
            "db_model": true,
            "key": "gpt-image-1",
            "max_tokens": null,
            "max_input_tokens": null,
            "max_output_tokens": null,
            "input_cost_per_token": 0,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": null,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": null,
            "output_cost_per_token_batches": null,
            "output_cost_per_token": 0,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "openai",
            "mode": "image_generation",
            "supports_system_messages": null,
            "supports_response_schema": null,
            "supports_vision": null,
            "supports_function_calling": null,
            "supports_tool_choice": null,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": null,
            "supports_audio_input": null,
            "supports_audio_output": null,
            "supports_pdf_input": null,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": null,
            "supports_url_context": null,
            "supports_reasoning": null,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": null,
            "rpm": null,
            "supported_openai_params": [
                "frequency_penalty",
                "logit_bias",
                "logprobs",
                "top_logprobs",
                "max_tokens",
                "max_completion_tokens",
                "modalities",
                "prediction",
                "n",
                "presence_penalty",
                "seed",
                "stop",
                "stream",
                "stream_options",
                "temperature",
                "top_p",
                "tools",
                "tool_choice",
                "function_call",
                "functions",
                "max_retries",
                "extra_headers",
                "parallel_tool_calls",
                "audio",
                "web_search_options",
                "response_format",
                "user"
            ]
        }
    },
    {
        "model_name": "gpt-4o",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "openAI",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "gpt-4o"
        },
        "model_info": {
            "id": "e89ada21-d0be-4a88-9e59-8e5388fa9f9b",
            "db_model": true,
            "key": "gpt-4o",
            "max_tokens": 16384,
            "max_input_tokens": 128000,
            "max_output_tokens": 16384,
            "input_cost_per_token": 0.0000025,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": 0.00000125,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": 0.00000125,
            "output_cost_per_token_batches": 0.000005,
            "output_cost_per_token": 0.00001,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "openai",
            "mode": "chat",
            "supports_system_messages": true,
            "supports_response_schema": true,
            "supports_vision": true,
            "supports_function_calling": true,
            "supports_tool_choice": true,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": true,
            "supports_audio_input": null,
            "supports_audio_output": null,
            "supports_pdf_input": true,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": null,
            "supports_url_context": null,
            "supports_reasoning": null,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": null,
            "rpm": null,
            "supported_openai_params": [
                "frequency_penalty",
                "logit_bias",
                "logprobs",
                "top_logprobs",
                "max_tokens",
                "max_completion_tokens",
                "modalities",
                "prediction",
                "n",
                "presence_penalty",
                "seed",
                "stop",
                "stream",
                "stream_options",
                "temperature",
                "top_p",
                "tools",
                "tool_choice",
                "function_call",
                "functions",
                "max_retries",
                "extra_headers",
                "parallel_tool_calls",
                "audio",
                "web_search_options",
                "response_format",
                "user"
            ]
        }
    },
    {
        "model_name": "deepseek-v3",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "llmapi",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "deepseek-v3"
        },
        "model_info": {
            "id": "d740b0dd-13de-40a9-98ee-483b4444895d",
            "db_model": true
        }
    },
    {
        "model_name": "Qwen2.5-Coder-32B-Instruct",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "llmapi",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "Qwen2.5-Coder-32B-Instruct"
        },
        "model_info": {
            "id": "92e426a1-29bd-433c-a626-dd71b0c37d39",
            "db_model": true
        }
    },
    {
        "model_name": "groq/deepseek-r1-distill-llama-70b",
        "litellm_params": {
            "custom_llm_provider": "groq",
            "litellm_credential_name": "groq",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "groq/deepseek-r1-distill-llama-70b"
        },
        "model_info": {
            "id": "282b4e84-7b60-49fb-b222-f7c2d97ae40e",
            "db_model": true,
            "key": "groq/deepseek-r1-distill-llama-70b",
            "max_tokens": 128000,
            "max_input_tokens": 128000,
            "max_output_tokens": 128000,
            "input_cost_per_token": 7.5e-7,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": null,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": null,
            "output_cost_per_token_batches": null,
            "output_cost_per_token": 9.9e-7,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "groq",
            "mode": "chat",
            "supports_system_messages": null,
            "supports_response_schema": true,
            "supports_vision": null,
            "supports_function_calling": true,
            "supports_tool_choice": true,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": null,
            "supports_audio_input": null,
            "supports_audio_output": null,
            "supports_pdf_input": null,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": null,
            "supports_url_context": null,
            "supports_reasoning": true,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": null,
            "rpm": null,
            "supported_openai_params": [
                "frequency_penalty",
                "logit_bias",
                "logprobs",
                "top_logprobs",
                "max_tokens",
                "max_completion_tokens",
                "modalities",
                "prediction",
                "n",
                "presence_penalty",
                "seed",
                "stop",
                "stream",
                "stream_options",
                "temperature",
                "top_p",
                "tools",
                "tool_choice",
                "function_call",
                "functions",
                "extra_headers",
                "parallel_tool_calls",
                "audio",
                "web_search_options",
                "response_format"
            ]
        }
    },
    {
        "model_name": "gemini/gemini-2.5-flash",
        "litellm_params": {
            "custom_llm_provider": "gemini",
            "litellm_credential_name": "google",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "gemini/gemini-2.5-flash"
        },
        "model_info": {
            "id": "93430c65-f0bf-4759-9260-676edaff5cf3",
            "db_model": true,
            "key": "gemini/gemini-2.5-flash",
            "max_tokens": 65535,
            "max_input_tokens": 1048576,
            "max_output_tokens": 65535,
            "input_cost_per_token": 3e-7,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": null,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": 0.000001,
            "input_cost_per_token_batches": null,
            "output_cost_per_token_batches": null,
            "output_cost_per_token": 0.0000025,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": 0.0000025,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "gemini",
            "mode": "chat",
            "supports_system_messages": true,
            "supports_response_schema": true,
            "supports_vision": true,
            "supports_function_calling": true,
            "supports_tool_choice": true,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": null,
            "supports_audio_input": null,
            "supports_audio_output": false,
            "supports_pdf_input": true,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": true,
            "supports_url_context": true,
            "supports_reasoning": true,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": 8000000,
            "rpm": 100000,
            "supported_openai_params": [
                "temperature",
                "top_p",
                "max_tokens",
                "max_completion_tokens",
                "stream",
                "tools",
                "tool_choice",
                "functions",
                "response_format",
                "n",
                "stop",
                "logprobs",
                "frequency_penalty",
                "modalities",
                "parallel_tool_calls",
                "web_search_options",
                "reasoning_effort",
                "thinking"
            ]
        }
    },
    {
        "model_name": "groq/mistral-saba-24b",
        "litellm_params": {
            "custom_llm_provider": "groq",
            "litellm_credential_name": "groq",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "groq/mistral-saba-24b"
        },
        "model_info": {
            "id": "f34a2ba5-a1cb-457f-9030-0a0f3011fc01",
            "db_model": true,
            "key": "groq/mistral-saba-24b",
            "max_tokens": 32000,
            "max_input_tokens": 32000,
            "max_output_tokens": 32000,
            "input_cost_per_token": 7.9e-7,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": null,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": null,
            "output_cost_per_token_batches": null,
            "output_cost_per_token": 7.9e-7,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "groq",
            "mode": "chat",
            "supports_system_messages": null,
            "supports_response_schema": null,
            "supports_vision": null,
            "supports_function_calling": null,
            "supports_tool_choice": null,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": null,
            "supports_audio_input": null,
            "supports_audio_output": null,
            "supports_pdf_input": null,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": null,
            "supports_url_context": null,
            "supports_reasoning": null,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": null,
            "rpm": null,
            "supported_openai_params": [
                "frequency_penalty",
                "logit_bias",
                "logprobs",
                "top_logprobs",
                "max_tokens",
                "max_completion_tokens",
                "modalities",
                "prediction",
                "n",
                "presence_penalty",
                "seed",
                "stop",
                "stream",
                "stream_options",
                "temperature",
                "top_p",
                "tools",
                "tool_choice",
                "function_call",
                "functions",
                "extra_headers",
                "parallel_tool_calls",
                "audio",
                "web_search_options",
                "response_format"
            ]
        }
    },
    {
        "model_name": "coder-large",
        "litellm_params": {
            "input_cost_per_token": 0,
            "output_cost_per_token": 0,
            "api_base": "https://api.llmapi.com/",
            "custom_llm_provider": "openai",
            "litellm_credential_name": "llmapi",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "coder-large"
        },
        "model_info": {
            "id": "14694f98-d8cc-4b74-85a5-c116d18f12aa",
            "db_model": true,
            "access_groups": [],
            "direct_access": true,
            "access_via_team_ids": [],
            "input_cost_per_token": 0,
            "output_cost_per_token": 0
        }
    },
    {
        "model_name": "gpt-4o-mini",
        "litellm_params": {
            "custom_llm_provider": "openai",
            "litellm_credential_name": "openAI",
            "use_in_pass_through": false,
            "use_litellm_proxy": false,
            "merge_reasoning_content_in_choices": false,
            "model": "gpt-4o-mini"
        },
        "model_info": {
            "id": "860918e0-dd3c-4ad1-a411-0e38c0685b3c",
            "db_model": true,
            "key": "gpt-4o-mini",
            "max_tokens": 16384,
            "max_input_tokens": 128000,
            "max_output_tokens": 16384,
            "input_cost_per_token": 1.5e-7,
            "cache_creation_input_token_cost": null,
            "cache_read_input_token_cost": 7.5e-8,
            "input_cost_per_character": null,
            "input_cost_per_token_above_128k_tokens": null,
            "input_cost_per_token_above_200k_tokens": null,
            "input_cost_per_query": null,
            "input_cost_per_second": null,
            "input_cost_per_audio_token": null,
            "input_cost_per_token_batches": 7.5e-8,
            "output_cost_per_token_batches": 3e-7,
            "output_cost_per_token": 6e-7,
            "output_cost_per_audio_token": null,
            "output_cost_per_character": null,
            "output_cost_per_reasoning_token": null,
            "output_cost_per_token_above_128k_tokens": null,
            "output_cost_per_character_above_128k_tokens": null,
            "output_cost_per_token_above_200k_tokens": null,
            "output_cost_per_second": null,
            "output_cost_per_image": null,
            "output_vector_size": null,
            "citation_cost_per_token": null,
            "litellm_provider": "openai",
            "mode": "chat",
            "supports_system_messages": true,
            "supports_response_schema": true,
            "supports_vision": true,
            "supports_function_calling": true,
            "supports_tool_choice": true,
            "supports_assistant_prefill": null,
            "supports_prompt_caching": true,
            "supports_audio_input": null,
            "supports_audio_output": null,
            "supports_pdf_input": true,
            "supports_embedding_image_input": null,
            "supports_native_streaming": null,
            "supports_web_search": null,
            "supports_url_context": null,
            "supports_reasoning": null,
            "supports_computer_use": null,
            "search_context_cost_per_query": null,
            "tpm": null,
            "rpm": null,
            "supported_openai_params": [
                "frequency_penalty",
                "logit_bias",
                "logprobs",
                "top_logprobs",
                "max_tokens",
                "max_completion_tokens",
                "modalities",
                "prediction",
                "n",
                "presence_penalty",
                "seed",
                "stop",
                "stream",
                "stream_options",
                "temperature",
                "top_p",
                "tools",
                "tool_choice",
                "function_call",
                "functions",
                "max_retries",
                "extra_headers",
                "parallel_tool_calls",
                "audio",
                "web_search_options",
                "response_format",
                "user"
            ]
        }
    }
]

```

## formato de respuesta del modelo
```json
{
    "id": "chatcmpl-bda82f52-6af8-47fd-a98e-8484c7f9bb9b",
    "created": 1752335740,
    "model": "mistral-saba-24b",
    "object": "chat.completion",
    "system_fingerprint": "fp_07e680a590",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "¡Sí, puedo ayudarte con programación! Depende de lo que necesites, puedo ofrecer ayuda con una variedad de lenguajes de programación como Python, JavaScript, Java, C++, HTML/CSS, y muchos otros. ¿Tienes alguna pregunta específica o necesitas ayuda con un problema en particular?",
                "role": "assistant",
                "tool_calls": null,
                "function_call": null
            }
        }
    ],
    "usage": {
        "completion_tokens": 63,
        "prompt_tokens": 81,
        "total_tokens": 144,
        "completion_tokens_details": null,
        "prompt_tokens_details": null,
        "queue_time": 0.196524209,
        "prompt_time": 0.004424101,
        "completion_time": 0.190909091,
        "total_time": 0.195333192
    },
    "usage_breakdown": null,
    "x_groq": {
        "id": "req_01jzznjvddfxyv11zfcmwn5ypt"
    },
    "service_tier": "on_demand"
}
```


## docuamenacion de searXNG api
URL en el VPS:   https://searxng.percyalvarez.com/

Search API[¶](#search-api "Link to this heading")
=================================================

The search supports both `GET` and `POST`.

Furthermore, two endpoints `/` and `/search` are available for querying.

`GET /`

`GET /search`

Parameters[¶](#parameters "Link to this heading")
-------------------------------------------------

Further reading ..

*   [Engine Overview](engines/engine_overview.html#engines-dev)
    
*   [settings.yml](../admin/settings/settings.html#settings-yml)
    
*   [Configured Engines](../user/configured_engines.html#configured-engines)
    

`q`required

The search query. This string is passed to external search services. Thus, SearXNG supports syntax of each search service. For example, `site:github.com SearXNG` is a valid query for Google. However, if simply the query above is passed to any search engine which does not filter its results based on this syntax, you might not get the results you wanted.

See more at [Search syntax](../user/search-syntax.html#search-syntax)

`categories`optional

Comma separated list, specifies the active search categories (see [Configured Engines](../user/configured_engines.html#configured-engines))

`engines`optional

Comma separated list, specifies the active search engines (see [Configured Engines](../user/configured_engines.html#configured-engines)).

`language`default from [search:](../admin/settings/settings_search.html#settings-search)

Code of the language.

`pageno`default `1`

Search page number.

`time_range`optional

\[ `day`, `month`, `year` \]

Time range of search for engines which support it. See if an engine supports time range search in the preferences page of an instance.

`format`optional

\[ `json`, `csv`, `rss` \]

Output format of results. Format needs to be activated in [search:](../admin/settings/settings_search.html#settings-search).

`results_on_new_tab`default `0`

\[ `0`, `1` \]

Open search results on new tab.

`image_proxy`default from [server:](../admin/settings/settings_server.html#settings-server)

\[ `True`, `False` \]

Proxy image results through SearXNG.

`autocomplete`default from [search:](../admin/settings/settings_search.html#settings-search)

\[ `google`, `dbpedia`, `duckduckgo`, `mwmbl`, `startpage`, `wikipedia`, `stract`, `swisscows`, `qwant` \]

Service which completes words as you type.

`safesearch`default from [search:](../admin/settings/settings_search.html#settings-search)

\[ `0`, `1`, `2` \]

Filter search results of engines which support safe search. See if an engine supports safe search in the preferences page of an instance.

`theme`default `simple`

\[ `simple` \]

Theme of instance.

Please note, available themes depend on an instance. It is possible that an instance administrator deleted, created or renamed themes on their instance. See the available options in the preferences page of the instance.

`enabled_plugins`optional

List of enabled plugins.

default:

`Hash_plugin`, `Self_Information`, `Tracker_URL_remover`, `Ahmia_blacklist`

values:

`Hash_plugin`, `Self_Information`, `Tracker_URL_remover`, `Ahmia_blacklist`,

`Hostnames_plugin`, `Open_Access_DOI_rewrite`, `Vim-like_hotkeys`, `Tor_check_plugin`

`disabled_plugins`: optional

List of disabled plugins.

default:

`Hostnames_plugin`, `Open_Access_DOI_rewrite`, `Vim-like_hotkeys`, `Tor_check_plugin`

values:

see values from `enabled_plugins`

`enabled_engines`optional_all_ [engines](https://github.com/searxng/searxng/blob/master/searx/engines)

List of enabled engines.

`disabled_engines`optional_all_ [engines](https://github.com/searxng/searxng/blob/master/searx/engines)

List of disabled engines.


## docuamenacion de browserless 
URL en el VPS: ws://154.53.42.52:5026

*   [](/)
*   Introduction

On this page

Introduction to Browserless Offerings
=====================================

Browserless is a cloud-based service for running headless browsers at scale. It provides multiple offerings for different use cases, all using the same cloud infrastructure but accessed in various ways. This overview introduces the three main Browserless offerings (excluding legacy v1, which is deprecated) and when to use each:

*   **[BrowserQL (BQL)](/browserql/start)** – A GraphQL-based API for browser automation. BQL is a first-class, stealth-focused solution ideal for bypassing [CAPTCHAs](/browserql/bot-detection/solving-captchas) and bot detectors. It comes with a fully-featured web IDE and uses a minimalistic, scriptable query language instead of traditional code.
    
*   **[Browsers as a Service (BaaS) v2](/baas/start)** – A direct browser-as-a-service API that you can connect to using standard libraries like [Puppeteer](/baas/start#connecting-puppeteer) or [Playwright](/baas/start#connecting-playwright). BaaS v2 closely mimics running a browser locally, allowing you to use familiar code by simply changing the connection URL to point at Browserless.
    
*   **[RESTful APIs](/rest-apis/intro)** – A set of ready-made HTTP endpoints for common browser tasks (such as generating PDFs or screenshots, scraping content, etc.). These endpoints let you perform automation via simple HTTP(S) requests without writing a full script. They are great for quick integrations or one-off tasks, although not as flexible for complex flows.
    

Which to choose?

Don't know which solution better fits your needs? Refer to the [API Comparison page](/overview/comparison), and find detailed information defining the best solution for each situation.

API Tokens and Authentication[​](#api-tokens-and-authentication "Direct link to API Tokens and Authentication")
---------------------------------------------------------------------------------------------------------------

All Browserless cloud offerings require an API token for authentication. When you sign up, you'll get a unique token associated with your account. Include this token in every request, usually as a query parameter `?token=<YOUR_API_TOKEN>`. (The token can also be provided via headers in some cases, but using the token in query strings is most reliable.) [Get your API token](https://account.browserless.io/).

Global Endpoints[​](#global-endpoints "Direct link to Global Endpoints")
------------------------------------------------------------------------

Browserless operates multiple regional endpoints for low-latency access. The primary shared clusters are in US West (SFO), EU West (London), and EU Central (Amsterdam) ([Load Balancers](/baas/load-balancers)). For example:

*   `https://production-sfo.browserless.io` – San Francisco, USA (default US endpoint)
*   `https://production-lon.browserless.io` – London, UK (European endpoint)
*   `https://production-ams.browserless.io` – Amsterdam, NL (another EU endpoint)

You can use the endpoint closest to your servers or users. All endpoints offer the same API and require your token.

Getting Started Checklist[​](#getting-started-checklist "Direct link to Getting Started Checklist")
---------------------------------------------------------------------------------------------------

To quickly get started with Browserless:

1.  [Get your API token](https://account.browserless.io/)
2.  Choose an API ([BrowserQL](/browserql/start), [BaaS v2](/baas/start), or [REST APIs](/rest-apis/intro))
3.  Follow the respective Quick Start guide for your chosen API

[

Next

API Comparison

](/overview/comparison)

*   [API Tokens and Authentication](#api-tokens-and-authentication)
*   [Global Endpoints](#global-endpoints)
*   [Getting Started Checklist](#getting-started-checklist)

---
*   [](/)
*   API Comparison

On this page

Comparison of BQL, BaaS v2, and REST APIs
=========================================

To choose the right Browserless offering, it helps to understand their differences. The table below summarizes key features and capabilities of BrowserQL (BQL) vs Browserless BaaS v2 vs RESTful APIs:

Feature/Capability

BrowserQL (BQL)

Browsers as a Service (v2)

REST APIs

Usage Paradigm

GraphQL queries (run via a cloud IDE or GraphQL endpoint)

Connect via WebSocket using Puppeteer/Playwright libraries

HTTP/HTTPS requests to specific endpoints

Primary Use-Case

Stealth web automation, bypassing bot detection and CAPTCHAs

Running custom automation scripts with familiar libraries

One-off tasks (PDF, screenshot, data extraction) via simple calls

Stealth Capabilities

Advanced (human-like behavior, CAPTCHA solving)

Basic (stealth mode parameter)

Basic (stealth parameter)

Flexibility

High (specialized automation language)

Highest (full browser control)

Limited (predefined endpoints)

Ease of Use

Medium (requires learning BQL)

Medium (requires knowledge of browser automation libraries)

Simplest (HTTP requests only)

Connection Method

HTTPS

WebSocket

HTTPS

Proxy Support

[Advanced (built-in residential)](/browserql/bot-detection/proxies)

[Yes (via parameters)](/baas/proxies)

[Yes (via parameters)](/baas/proxies)

Session Management

Yes (reconnect mutation)

Yes (with proper setup)

No (stateless)

When to Use Each API[​](#when-to-use-each-api "Direct link to When to Use Each API")
------------------------------------------------------------------------------------

### BrowserQL[​](#browserql "Direct link to BrowserQL")

Best for scenarios requiring advanced bot detection bypass, such as:

*   Sites with sophisticated bot detection systems
*   When CAPTCHA solving is required
*   When you need human-like browser behavior
*   For stealth-first web automation

### BaaS v2[​](#baas-v2 "Direct link to BaaS v2")

Ideal for general-purpose browser automation:

*   When you have existing Puppeteer or Playwright code
*   For scenarios where you need full browser control
*   For complex multi-step workflows
*   When you're comfortable with browser automation libraries

### REST APIs[​](#rest-apis "Direct link to REST APIs")

Perfect for simple, stateless operations:

*   Taking screenshots
*   Generating PDFs
*   Basic content extraction
*   When integration simplicity is the priority
*   For one-off tasks that don't require maintaining state

[

Previous

Introduction

](/overview/intro)[

Next

Connection URLs

](/overview/connection-urls)

*   [When to Use Each API](#when-to-use-each-api)
    *   [BrowserQL](#browserql)
    *   [BaaS v2](#baas-v2)
    *   [REST APIs](#rest-apis)

---
*   [](/)
*   Connection URLs

On this page

Connection URLs and Endpoints
=============================

This section covers all connection URLs and endpoints for Browserless services. Learn when to use WebSocket (wss://) vs HTTP(S) URLs, and how to include your token and options in these URLs.

### Connection URL Builder

Service Type:

BrowserQLBaaS v2REST API

Library:

PuppeteerPlaywright

Browser:

ChromiumChrome

Stealth Mode:

DisabledEnabled

Region:

US WestEurope UKEurope Amsterdam

API Token:

#### Connection URL:

Copy

wss://production-sfo.browserless.io/?token=YOUR\_TOKEN

#### Code Snippet:

Copy

const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://production-sfo.browserless.io/?token=YOUR\_TOKEN',
});

Base URL and Regions[​](#base-url-and-regions "Direct link to Base URL and Regions")
------------------------------------------------------------------------------------

Browserless has multiple regional base URLs:

*   `https://production-sfo.browserless.io` (US West)
*   `https://production-lon.browserless.io` (Europe UK)
*   `https://production-ams.browserless.io` (Europe Amsterdam)

For WebSocket connections, simply replace `https://` with `wss://` for the same host. For example:

*   WebSocket (Puppeteer/Playwright): `wss://production-sfo.browserless.io/...`
*   HTTP REST API call: `https://production-sfo.browserless.io/...`

Choose the region closest to you to reduce latency (see [Load Balancers](/baas/load-balancers)). All require the token query parameter.

Using Your API Token in URLs[​](#using-your-api-token-in-urls "Direct link to Using Your API Token in URLs")
------------------------------------------------------------------------------------------------------------

Add your API token to the URL query string as `?token=YOUR_TOKEN`. Required for authentication (see [Using your API token](/baas/start)). Invalid tokens result in HTTP 401/403 errors. Keep this URL secure and never expose it in client-side code or logs.

Example: `wss://production-sfo.browserless.io?token=094632bb-e326-4c63-b953-82b55700b14c` is a basic connection string for a new Chrome session on the SFO cluster using the given token.

BrowserQL Connection[​](#browserql-connection "Direct link to BrowserQL Connection")
------------------------------------------------------------------------------------

If you are using the BQL IDE, the connection is handled for you (the IDE lets you select a region and enters your token). However, advanced users can also call the BQL service directly via a GraphQL HTTP request or WebSocket:

*   **GraphQL HTTP Endpoint**: You can send a GraphQL HTTP POST to the base URL with `/chrome/bql` or `/chromium/bql`. For example: `POST https://production-sfo.browserless.io/chrome/bql?token=YOUR_TOKEN`. The body of the request should be a JSON with your GraphQL query or mutation. The response will be JSON with your results. (This is usually used for the management GraphQL API for checking session pressure, etc., not commonly for running BQL browser sessions, which are handled by the dedicated BQL endpoint.)
    
*   **Dedicated BQL Endpoint**: When running browser sessions with BQL, Browserless uses a special endpoint internally (often shown as `/bql`). For instance, when a BQL session is created, it may run at a URL like `https://production-sfo.browserless.io/bql/SESSION_ID?token=YOUR_TOKEN`. This is typically abstracted away by the IDE or the initial request. In practice, you will start a BQL session via the IDE or a GraphQL call, and if you need to reconnect to it for a hybrid scenario, you'll use the reconnect URL provided in the response (which looks like the above). In summary, for pure BQL usage, you normally don't manually construct these URLs.
    

BaaS v2 (Puppeteer/Playwright) Connection URLs[​](#baas-v2-puppeteerplaywright-connection-urls "Direct link to BaaS v2 (Puppeteer/Playwright) Connection URLs")
---------------------------------------------------------------------------------------------------------------------------------------------------------------

To connect an automation library to Browserless, use a WebSocket URL (`wss://`). The WebSocket endpoint tells Browserless to launch a browser for you and gives you control over it. The format can vary slightly depending on the browser and library:

*   **Puppeteer (Chrome/Chromium)**: Use the base WebSocket URL with your token. Example: `wss://production-sfo.browserless.io?token=YOUR_TOKEN`. This will launch a Chromium instance on Browserless. Puppeteer's browserWSEndpoint should be set to this URL (see [How it Works](/baas/start)).
    
    note
    
    By default, this gives you a Chromium browser. Browserless treats Chrome/Chromium essentially the same; you can explicitly request Chrome by using `/chrome` in the path, but on the cloud service the default is a headless Chromium build with necessary features.
    
*   **Playwright (Chromium via CDP)**: Playwright can connect over Chrome DevTools Protocol (CDP) similarly to Puppeteer. You would use `playwright.chromium.connect_over_cdp("wss://production-sfo.browserless.io?token=YOUR_TOKEN")`. This is effectively the same as Puppeteer's approach and will give you a Chromium browser (see [Launch Options](/baas/chrome-flags)).
    
*   **Playwright (Firefox)**: To use Firefox (since Playwright supports Firefox via its own protocol), you must include the browser in the path and specify that you want the Playwright protocol. Browserless uses a convention: `/<browser>/playwright` in the URL for Playwright connections. So for Firefox: `wss://production-sfo.browserless.io/firefox/playwright?token=YOUR_TOKEN` (see [How it Works](/baas/start)).
    
*   **Playwright (WebKit)**: `wss://production-sfo.browserless.io/webkit/playwright?token=YOUR_TOKEN` – spawns a WebKit browser (usually for Safari automation needs). WebKit support is available in Browserless v2 for Playwright connections.
    
*   **Selecting Chrome vs Chromium**: If you specifically need Chrome (the branded Google Chrome, which might have minor differences or supports Widevine, etc.), you can use the path `/chrome` in the URL. For example: `wss://production-sfo.browserless.io/chrome?token=YOUR_TOKEN`. By default, `/` or `/chromium` point to the latest Chromium. In practice, most use cases don't require distinguishing, but the option exists.
    

### Summary of WebSocket URL formats[​](#summary-of-websocket-url-formats "Direct link to Summary of WebSocket URL formats")

*   **Chromium (puppeteer, playwright ConnectOverCDP or other CDP libraries)**: `wss://production-<region>.browserless.io/?token=YOUR_TOKEN`
*   **Chromium (Playwright connect's method)**: `wss://production-<region>.browserless.io/chromium/playwright?token=YOUR_TOKEN`
*   **Chrome (stable version)**: `wss://production-<region>.browserless.io/chrome?token=YOUR_TOKEN`
*   **Firefox (Playwright)**: `wss://production-<region>.browserless.io/firefox/playwright?token=YOUR_TOKEN`
*   **WebKit (Playwright)**: `wss://production-<region>.browserless.io/webkit/playwright?token=YOUR_TOKEN`

REST APIs[​](#rest-apis "Direct link to REST APIs")
---------------------------------------------------

Browserless provides REST API endpoints for common operations:

    // Screenshot APIhttps://production-sfo.browserless.io/screenshot?token=YOUR_TOKEN// PDF APIhttps://production-sfo.browserless.io/pdf?token=YOUR_TOKEN// Content APIhttps://production-sfo.browserless.io/content?token=YOUR_TOKEN

Launch Parameters and Options[​](#launch-parameters-and-options "Direct link to Launch Parameters and Options")
---------------------------------------------------------------------------------------------------------------

Browserless allows extensive configuration of how browsers are launched and behave during your sessions. These launch parameters can be provided either via query parameters in the URL or through a special JSON launch payload. Whether you're using BQL, BaaS v2, or REST, these options let you tweak the browser environment to fit your needs.

### Passing Launch Options[​](#passing-launch-options "Direct link to Passing Launch Options")

There are two ways to specify launch options on Browserless v2:

1.  **Individual Query Parameters**: Many common options can be set by adding a query parameter to your connection URL or API call. For example, `&headless=false` to run in headful mode, `&proxy=residential` to use the built-in residential proxies, etc. This is straightforward for boolean or simple options.
    
2.  **Combined launch Parameter (JSON)**: For complex configurations, you can use a single query param `launch` with a JSON string as its value. This JSON can include any Chrome flags or Browserless-specific settings in a structured way. This approach is useful when you need to set multiple flags at once or use non-boolean values. It's essentially the equivalent of Puppeteer's `launch({ options })` but provided to the cloud service. For example, `&launch={"headless":false,"stealth":true,"args":["--window-size=1920,1080"]}` (URL-encoded) would configure a headful, stealth-enabled browser with a specific window size (see [Launch Options](/baas/chrome-flags)).
    

Both methods achieve the same result. Under the hood, Browserless will merge any individual query params with the JSON launch config if both are provided (individual params typically override the JSON fields if there's overlap). For simplicity, if you only need to toggle a few settings, use query params; if you have many settings, use the single launch param.

### Common Launch Options (Query Parameters)[​](#common-launch-options-query-parameters "Direct link to Common Launch Options (Query Parameters)")

Below is a list of common launch options you can use in query strings. Unless stated otherwise, these can be used in BaaS v2 (library connections) and REST API calls alike. (BrowserQL internally uses some of these, but BQL users typically set these via the IDE session settings rather than manually in a URL.)

*   **headless** (boolean): Default: true (headless mode). Set to false to launch the browser in "headful" mode (with a GUI). In cloud environments you won't actually see a GUI, but headful mode can sometimes bypass bot detection (since some bots detect headless). Using `headless=false` will consume more resources. Example: `&headless=false`.
    
*   **stealth** (boolean): Default: false (for BaaS/REST). Enable stealth plugin/mode for the browser. If true, Browserless will apply stealth techniques to the browser (like puppeteer-extra's stealth plugin) to remove obvious automation signals. In BrowserQL, stealth is generally always on by design (hence no toggle in BQL except through humanlike). In BaaS, you might use `stealth=true` when you need some bot evasion but are not using BQL. Example: `&stealth=true`.
    

You can also use the stealth URLs directly:

*   `/chrome/stealth` - For stealthy Chrome browser
*   `/chromium/stealth` or `/stealth` - For stealthy Chromium browser

These endpoints are only available for Enterprise and Cloud-unit plans and provide improved bot detection evasion compared to the stealth query parameter alone.

*   **humanlike** (boolean): Default: false. (BrowserQL only.) This enables Human-like behavior – simulation of human input patterns (mouse movements, random small delays, etc.) to make automation less detectable. Example: `&humanlike=true`.

For a complete list of launch options, see the [Launch Options](/baas/chrome-flags) documentation.

[

Previous

API Comparison

](/overview/comparison)[

Next

Launch Parameters

](/overview/launch-parameters)

*   [Base URL and Regions](#base-url-and-regions)
*   [Using Your API Token in URLs](#using-your-api-token-in-urls)
*   [BrowserQL Connection](#browserql-connection)
*   [BaaS v2 (Puppeteer/Playwright) Connection URLs](#baas-v2-puppeteerplaywright-connection-urls)
    *   [Summary of WebSocket URL formats](#summary-of-websocket-url-formats)
*   [REST APIs](#rest-apis)
*   [Launch Parameters and Options](#launch-parameters-and-options)
    *   [Passing Launch Options](#passing-launch-options)
    *   [Common Launch Options (Query Parameters)](#common-launch-options-query-parameters)

---

*   [](/)
*   Launch Parameters

On this page

Launch Parameters
=================

Configure how browsers launch and behave with parameters provided via URL query parameters or JSON payload. This section covers available options, defaults, and usage across [BrowserQL](/browserql/start), [BaaS v2](/baas/start), and [REST APIs](/rest-apis/intro).

Passing Launch Options[​](#passing-launch-options "Direct link to Passing Launch Options")
------------------------------------------------------------------------------------------

Two ways to specify launch options:

1.  **Individual Query Parameters**: Add options directly to URLs (e.g., `&headless=false`, `&proxy=residential`). Best for simple boolean options.
    
2.  **Combined `launch` Parameter (JSON)**: For complex configurations, use a single query param `launch` with a JSON string as its value. This JSON can include any Chrome flags or Browserless-specific settings in a structured way. It's essentially the equivalent of Puppeteer's `launch({ options })` but provided to the cloud service:
    
        &launch={"headless":false,"stealth":true,"args":["--window-size=1920,1080"]}
    
    (URL-encoded) would configure a headful, stealth-enabled browser with a specific window size.
    

Browserless merges both methods if used together, with individual parameters taking precedence. Use query params for simple toggles and the launch parameter for multiple settings.

Common Launch Options[​](#common-launch-options "Direct link to Common Launch Options")
---------------------------------------------------------------------------------------

Below is a list of common launch options you can use in query strings. Unless stated otherwise, these can be used in BaaS v2 (library connections) and REST API calls alike. BrowserQL internally uses some of these, but BQL users typically set these via the IDE session settings rather than manually in a URL.

Parameter

Description

Default

BrowserQL

BaaS v2

REST APIs

headless

Runs the browser in headless mode. Set to false to enable headful mode (with a GUI). While the GUI isn't visible in cloud environments, headful mode may help bypass bot detection. Note: it uses more resources.

`true`

✅

✅

✅

stealth

Enables stealth mode to reduce automation signals (similar to puppeteer-extra’s stealth plugin). In BQL, stealth is always on by design and controlled via the humanlike option. In BaaS/REST, set to true to enable stealth techniques.

*   `false` (for BaaS/REST)
*   `true` (for BQL)

✅

✅

✅

humanlike

Simulates human-like behavior such as natural mouse movement, typing, and random delays. In the BQL IDE, this can be toggled in session settings. For direct BQL GraphQL calls, use humanlike: true in the launch payload. Recommended for strict bot detection scenarios.

`false`

✅

❌

❌

blockAds

Enables the built-in ad blocker (powered by uBlock Origin). Helps speed up scripts and reduce noise by blocking ads and trackers. Especially useful for scraping to avoid popups and clutter.

`false`

✅

✅

✅

blockConsentModals

Automatically blocks or dismisses cookie/GDPR consent banners. Available in BQL sessions and the /screenshot and /pdf REST APIs. In BQL, toggle it via the IDE or launch JSON. Useful for cleaner scraping by removing overlays.

`false`

✅

❌

✅

proxy

Routes browser traffic through a proxy. Only supports proxy=residential for Browserless's residential proxy pool. Omit to use the IP of the machine in the cloud running the container, meaning it's a fixed datacenter IP.

none

✅

✅

✅

proxyCountry

Used with proxy=residential to specify the exit node’s country. Accepts ISO 3166 country codes (e.g., us, gb, de). If omitted, a random location is chosen.

none

✅

✅

✅

proxySticky

Used with proxy=residential to maintain the same proxy IP across a session (when possible). Useful for sites that expect consistent IP usage.

`false`

✅

✅

✅

timeout

Maximum session duration in milliseconds. The session will automatically close after this time to prevent overuse.

60000

✅

✅

✅

BaaS v2 Advanced Options[​](#baas-v2-advanced-options "Direct link to BaaS v2 Advanced Options")
------------------------------------------------------------------------------------------------

For BaaS v2, you can use the `launch` parameter to pass a JSON object with advanced Chrome flags and Puppeteer options. Learn more in our [Launch Options guide](/baas/chrome-flags):

*   Puppeteer
*   Playwright

    const launchArgs = {  headless: false,  stealth: true,  args: ['--window-size=1920,1080', '--force-color-profile=srgb']};const browser = await puppeteer.connect({  browserWSEndpoint: `wss://production-sfo.browserless.io?token=YOUR_API_TOKEN&launch=${JSON.stringify(launchArgs)}`,});

    const launchArgs = {  headless: false,  stealth: true,  args: ['--window-size=1920,1080', '--force-color-profile=srgb']};const browser = await playwright.chromium.connectOverCDP(  `wss://production-sfo.browserless.io?token=YOUR_API_TOKEN&launch=${JSON.stringify(launchArgs)}`);

REST API Options[​](#rest-api-options "Direct link to REST API Options")
------------------------------------------------------------------------

When using REST APIs, you can include launch parameters in the URL query string or in the JSON body of your request:

    // In URL query stringfetch("https://production-sfo.browserless.io/screenshot?token=YOUR_API_TOKEN&blockAds=true&stealth=true")// In JSON bodyfetch("https://production-sfo.browserless.io/pdf?token=YOUR_API_TOKEN", {  method: "POST",  headers: { "Content-Type": "application/json" },  body: JSON.stringify({    url: "https://example.com",    options: { format: "A4" },    launch: { stealth: true, blockAds: true }  })})

For a comprehensive list of available REST API endpoints and their parameters, please refer to our [Swagger API documentation](/open-api).

For a comprehensive list of Chrome flags and browserless-specific options, please refer to our [Launch Options](/baas/chrome-flags) documentation.

[

Previous

Connection URLs

](/overview/connection-urls)

*   [Passing Launch Options](#passing-launch-options)
*   [Common Launch Options](#common-launch-options)
*   [BaaS v2 Advanced Options](#baas-v2-advanced-options)
*   [REST API Options](#rest-api-options)

### ejemplo de uso
```bash
const puppeteer = require('puppeteer');
const fs = require('fs');
const TurndownService = require('turndown'); // Para convertir HTML a Markdown

// Inicializa el servicio de Turndown
const turndownService = new TurndownService();

// =======================================================================
// === CONFIGURACIÓN PERSONALIZABLE ===
// =======================================================================

// URL del WebSocket de tu instancia de Browserless Docker.
// - SI TU SCRIPT SE EJECUTA EN LA MISMA MÁQUINA QUE DOCKER (y puerto 3000 está mapeado): 'ws://localhost:3000'
// - SI DOCKER ESTÁ EN UN SERVIDOR REMOTO: 'ws://<IP_DE_TU_SERVIDOR>:3000'
// - Si mapeaste Browserless al puerto 5026: 'ws://154.53.42.52:5026' (como en tu configuración)
const BROWSERLESS_WS_ENDPOINT = 'ws://154.53.42.52:5026'; 

// LA URL ESPECÍFICA QUE QUIERES LEER
const TARGET_URL = 'https://docs.browserless.io/overview/launch-parameters';

// Nombre base del archivo donde se guardará el contenido y la captura de pantalla.
// Se generará automáticamente a partir de la URL para que sea descriptivo.
const OUTPUT_FILENAME_BASE = 'searxng_search_api_docs'; 

// Formato de salida del contenido: 'markdown' o 'plain_text'
const OUTPUT_FORMAT = 'markdown'; // Puedes cambiar a 'plain_text' si lo prefieres

// SELECTORES CSS para identificar el "contenido principal" de una página.
// El script probará cada selector en orden hasta que encuentre uno que exista en la página.
// Para el sitio de documentación de SearXNG (Sphinx Docs), 'article.document' o 'div.body' suelen funcionar bien.
const CONTENT_SELECTORS = [
    'article.document', // Específico para documentos generados con Sphinx/ReadTheDocs
    'div.body',         // Un div que a menudo contiene el cuerpo principal en este tipo de docs
    'main',             // Elemento semántico de HTML5 para el contenido principal
    '#content',         // ID genérico para el área de contenido
    'body'              // Último recurso: captura todo el body. Requiere más limpieza después.
];

// =======================================================================
// === FUNCIÓN PRINCIPAL DE NAVEGACIÓN Y EXTRACCIÓN ===
// =======================================================================

async function readSpecificWebPage() {
    let browser; 
    
    try {
        console.log(`[INFO] Conectándose a Browserless en: ${BROWSERLESS_WS_ENDPOINT}...`);
        browser = await puppeteer.connect({
            browserWSEndpoint: BROWSERLESS_WS_ENDPOINT,
            defaultViewport: null 
        });
        console.log(`[INFO] Conexión establecida. Abriendo una nueva pestaña...`);

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 }); 

        // --- PASO 1: Navegar a la URL específica ---
        console.log(`\n[PROCESO] Navegando a la URL: ${TARGET_URL}...`);
        // 'networkidle2' espera a que la red esté inactiva.
        // Aumenta el timeout si la página es lenta.
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 }); 
        console.log(`[OK] Página cargada exitosamente.`);

        // --- PASO 2: Extraer el contenido principal de la página ---
        console.log(`\n[PROCESO] Intentando extraer el contenido principal de la página usando selectores...`);
        let contentHTML = null;
        let selectedSelector = 'body'; 

        for (const selector of CONTENT_SELECTORS) {
            try {
                // $eval busca el primer elemento que coincide y ejecuta la función en el navegador.
                contentHTML = await page.$eval(selector, element => element.innerHTML);
                selectedSelector = selector;
                console.log(`[INFO] Contenido extraído usando el selector: '${selector}'.`);
                break; // Detenemos el bucle al encontrar el primer selector válido
            } catch (e) {
                // Selector no encontrado, intentamos con el siguiente
            }
        }

        if (!contentHTML || contentHTML.trim() === '') {
            console.warn(`[ADVERTENCIA] No se pudo encontrar un selector de contenido específico. Extrayendo el contenido completo del 'body'.`);
            contentHTML = await page.$eval('body', element => element.innerHTML);
            selectedSelector = 'body'; 
        }
        
        // --- PASO 3: Convertir el contenido al formato deseado y guardarlo ---
        let outputContent;
        let fileExtension;

        if (OUTPUT_FORMAT === 'markdown') {
            console.log(`[PROCESO] Convirtiendo contenido a Markdown...`);
            outputContent = turndownService.turndown(contentHTML);
            fileExtension = 'md';
        } else if (OUTPUT_FORMAT === 'plain_text') {
            console.log(`[PROCESO] Extrayendo texto plano del contenido...`);
            // Para texto plano, es mejor extraer el innerText directamente del elemento
            // que fue seleccionado como contenido principal.
            outputContent = await page.$eval(selectedSelector, element => element.innerText);
            fileExtension = 'txt';
        } else {
            console.error(`[ERROR] Formato de salida no soportado: '${OUTPUT_FORMAT}'.`);
            return;
        }

        const outputFilename = `${OUTPUT_FILENAME_BASE}.${fileExtension}`;
        fs.writeFileSync(outputFilename, outputContent);
        console.log(`[OK] Contenido guardado exitosamente en: ${outputFilename}`);

        // --- PASO 4: Tomar una captura de pantalla de la página ---
        const screenshotPath = `${OUTPUT_FILENAME_BASE}.png`;
        console.log(`\n[PROCESO] Tomando captura de pantalla y guardándola como "${screenshotPath}"...`);
        await page.screenshot({ path: screenshotPath, fullPage: true }); 
        console.log(`[OK] Captura de pantalla guardada exitosamente.`);

    } catch (error) {
        console.error('\n--- ¡HA OCURRIDO UN ERROR INESPERADO! ---');
        console.error('Mensaje de error:', error.message);
        if (error.message.includes('ERR_CONNECTION_REFUSED') || error.message.includes('ECONNREFUSED')) {
            console.error('CONSEJO: Asegúrate de que el contenedor de Browserless esté ejecutándose y que la variable BROWSERLESS_WS_ENDPOINT esté configurada correctamente y sea accesible.');
        } else if (error.message.includes('Timeout')) {
            console.error('CONSEJO: La página tardó demasiado en cargar. Intenta aumentar el "timeout" en page.goto().');
        }
        console.error('Detalles completos del error:', error);
    } finally {
        // Asegúrate siempre de cerrar la conexión al navegador para liberar recursos
        if (browser) {
            console.log(`\n[INFO] Desconectando de Browserless...`);
            await browser.disconnect();
            console.log(`[INFO] Desconexión completada.`);
        }
    }
}

// Ejecuta la función principal al iniciar el script
readSpecificWebPage();
```