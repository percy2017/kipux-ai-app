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