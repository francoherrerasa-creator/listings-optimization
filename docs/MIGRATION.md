# Playbook de Migración

> Migrar este proyecto a una cuenta corporativa nueva en **menos de 1 hora**.

## Prerrequisitos

- Node.js 18+
- npm
- Cuenta de GitHub
- Cuenta de Vercel
- Cuenta de Anthropic (console.anthropic.com)
- Cuenta de Google Cloud

---

## Paso 1: Crear cuentas y accesos

| Servicio | Acción | URL |
|----------|--------|-----|
| Anthropic | Crear cuenta y generar API key | https://console.anthropic.com/settings/keys |
| Google Cloud | Crear proyecto nuevo | https://console.cloud.google.com |
| GitHub | Crear cuenta u org | https://github.com |
| Vercel | Crear team | https://vercel.com |

## Paso 2: Crear Service Account en Google Cloud

1. Ir a **IAM & Admin → Service Accounts** en tu proyecto de Google Cloud.
2. Click **Create Service Account**.
3. Nombre: `listing-quality-sync` (o el que prefieras).
4. No asignar roles de proyecto (no necesita).
5. Click **Done**.
6. En la lista de service accounts, click en el que creaste → **Keys → Add Key → Create new key → JSON**.
7. Descarga el archivo JSON. Lo necesitarás en el paso 5.

## Paso 3: Compartir el Google Sheet

1. Abre el Google Sheet con los listings sintéticos.
2. Click **Compartir**.
3. Pega el `client_email` del JSON descargado (ej: `nombre@proyecto.iam.gserviceaccount.com`).
4. Asigna rol **Editor**.
5. Click **Enviar**.

## Paso 4: Clonar el repo y cambiar remote

```bash
git clone https://github.com/francoherrerasa-creator/listing-quality-sync.git
cd listing-quality-sync
git remote set-url origin https://github.com/TU-ORG/listing-quality-sync.git
git push -u origin main
```

## Paso 5: Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con los valores del JSON de Google Cloud:

| Variable | Dónde encontrarla |
|----------|-------------------|
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Campo `client_email` del JSON |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Campo `private_key` del JSON (preservar `\n`) |

## Paso 6: Rebrandear en `/lib/config.ts`

Edita los siguientes campos:

```typescript
brand: {
  name: "Tu Empresa Growth Lab",
  shortName: "TUGL",
  ownerName: "Tu Nombre",
  ownerLinkedIn: "https://linkedin.com/in/tu-perfil/",
  primaryColor: "#TU_COLOR",
  secondaryColor: "#TU_COLOR",
}
urls: {
  dashboardUrl: "https://tu-dominio.vercel.app",
  githubUrl: "https://github.com/tu-org/listing-quality-sync",
  parentLabUrl: "https://github.com/tu-org/tu-lab",
}
```

## Paso 7: Deploy a Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

En el dashboard de Vercel, agrega las variables de entorno de `.env.local` en **Settings → Environment Variables**.

## Paso 8: Verificar

1. Abre la URL del deploy.
2. Confirma que la home page muestra tu branding nuevo.
3. (En pasos futuros) Verifica que el scoring funcione con tu Sheet.

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Error de autenticación Google | Verifica que el Sheet esté compartido con el email del service account |
| API key inválida | Regenera la key en Anthropic Console |
| Build falla en Vercel | Revisa que todas las env vars estén configuradas en Vercel |
| Colores no cambian | Limpia caché del browser o haz hard refresh |
