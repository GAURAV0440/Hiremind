from groq import Groq

from config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


def ask_llm(
    prompt: str,
    system_prompt: str | None = None,
    temperature: float | None = None,
    max_tokens: int = 1024
) -> str:
    """
    Send a prompt to the configured LLM.
    """

    if settings.LLM_PROVIDER.lower() != "groq":
        raise ValueError(
            f"Unsupported provider: {settings.LLM_PROVIDER}"
        )

    messages = []

    if system_prompt:
        messages.append(
            {
                "role": "system",
                "content": system_prompt
            }
        )

    messages.append(
        {
            "role": "user",
            "content": prompt
        }
    )

    try:

        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            temperature=(
                temperature
                if temperature is not None
                else settings.TEMPERATURE
            ),
            max_tokens=max_tokens
        )

        text = response.choices[0].message.content

        if not text:
            raise ValueError(
                "Empty response received from LLM."
            )

        return text.strip()

    except Exception as e:

        raise RuntimeError(
            f"LLM Error: {e}"
        )