# Gemini Setup

LifePilot AI uses Google AI Studio and Gemini as the core AI tool.

## Steps

1. Open Google AI Studio.
2. Create a Gemini API key.
3. Add it to `.env` as `VITE_GEMINI_API_KEY`.
4. Keep `VITE_GEMINI_MODEL=gemini-2.5-flash-lite` for fast, low-demand planning.
5. Keep `VITE_GEMINI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.5-flash` so the app can retry a second Gemini model before using the local fallback plan.
6. Keep `VITE_GEMINI_VOICE_MODEL=gemini-2.5-flash-lite` and `VITE_GEMINI_VOICE_FALLBACK_MODELS=gemini-2.5-flash-lite` for voice command JSON extraction. This avoids the higher-demand Flash model during demos.

## AI Outputs

Gemini generates:

- Priority ranking
- Deadline risk warning
- Task breakdown
- Today action plan
- Smart reminder message
- Productivity coaching
- Emergency Mode survival plan
- Voice command task extraction

## Security Note

For the hackathon MVP, the frontend can call Gemini directly. For production, route Gemini calls through a trusted backend or Firebase Cloud Function.
