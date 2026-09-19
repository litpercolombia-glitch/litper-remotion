# litper-remotion

Capa de video Remotion para `litper-autoedit-v8` — hook cinético (video-as-text-mask), tarjeta de oferta, grano y pulso de exposición, montados sobre el clip fuente de cada video ad de Litper.

## Versiones del componente

- **HookIntro** (`src/HookIntro.tsx`) — V1, reveal cinético básico (palabra + wipe circular).
- **HookIntroV2** (`src/HookIntroV2.tsx`) — V2 "pattern-interrupt/loud badge". Rechazado por el CEO por verse "gamer/barato". Se conserva como referencia histórica.
- **HookIntroV3** (`src/HookIntroV3.tsx`) — **versión activa/aprobada**. Estética "elegante": serif, glassmorphism, grano, pulso de exposición único, color de acento parametrizable. Usado en producción desde LOTE_02.

## Props de HookIntroV3

```ts
{
  hookWord: string;       // palabra gancho a revelar
  introFrames: number;    // duración del reveal (frames)
  pulseFrames: number;    // duración del pulso de exposición (frames)
  offerStart: number;     // frame de inicio de la tarjeta de oferta
  offerEnd: number;       // frame de fin de la tarjeta de oferta
  offerLabel: string;     // texto de la oferta
  videoFile?: string;     // nombre del archivo en /public (default 'source.mp4')
  accentColor?: string;   // hex, default '#d4af37' (oro) — rotar por video para variedad (Paso 5-bis)
}
```

## Setup

```bash
npm install
```

Coloca el/los video(s) fuente en `public/` (ej. `public/source.mp4`, o `public/lote02_1.mp4` etc.) y agrega una `<Composition>` en `src/Root.tsx` apuntando a ese `videoFile`.

## Preview / Studio

```bash
npx remotion studio
```

## Render

```bash
npx remotion render src/index.ts <composition-id> out.mp4 --codec=h264 --crf=18
```

El output de Remotion es video-only (sin audio, porque `OffthreadVideo` se monta `muted`). El mux con el audio original del clip fuente se hace después, con ffmpeg:

```bash
ffmpeg -y -i <video_only.mp4> -i <original_source.mp4> \
  -map 0:v:0 -map 1:a:0? \
  -vf "unsharp=5:5:1.0:5:5:0.0" \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 22 -preset fast \
  -c:a aac -b:a 128k -shortest -movflags +faststart \
  <output.mp4>
```

## Timing de la oferta (offerStart/offerEnd)

Se obtienen transcribiendo el audio del clip fuente con `faster-whisper` (modelo `small`, `cpu`, `int8`) y convirtiendo el timestamp exacto de la línea de oferta a frames: `frame = round(segundos * 30fps)`.

## Motor de variedad (Paso 5-bis, litper-autoedit-v8)

Nunca repetir más de una palanca visual entre videos consecutivos de una misma ronda. La palanca usada hoy es `accentColor`, rotando entre:

- Oro `#d4af37`
- Rosa viejo `#b76e79`
- Plata `#c9c9c9`
- Cobre `#b87333`

## Ejemplo real: LOTE_02

`src/Root.tsx` tiene las 5 composiciones `lote02-1` … `lote02-5` usadas en la ronda real del 2026-09-18, cada una con su `hookWord`, `videoFile` y `accentColor` propios. Sirven de plantilla para la siguiente ronda.

## Contexto

Parte del stack de producción de video de Litper Group, documentado en la skill `litper-autoedit-v8` (Paso 4-ter-bis). El paso final del pipeline (fuera de este repo) es la marca de agua cinética "Litper Oficial" (skill `litper-marca-de-agua`), aplicada con ffmpeg sobre el video ya muxeado.
