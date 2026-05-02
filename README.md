# Listing Quality Sync

**Franco Herrera Growth Lab** — Growth systems built with AI

---

## El problema

EasyBroker monetiza por tiers según cantidad de anuncios publicados ($490–$1,990+ MXN/mes). Pincali, su marketplace con 443K propiedades, no monetiza directo — su función es generar leads que justifiquen upgrades de tier. Pero el funnel free-to-paid está roto: si el inventario en Pincali tiene baja calidad (descripciones vacías, fotos pixeladas, precios absurdos), las búsquedas no convierten a leads, los asesores no ven valor, y no hay upgrade. La calidad del inventario es la palanca oculta del ARPU.

## La hipótesis

Un sistema de scoring con IA que evalúe cada listing antes de publicarlo en Pincali puede filtrar el inventario de baja calidad, mejorar la tasa de conversión búsqueda→lead, y crear un feedback loop donde los asesores mejoran sus listings para obtener más visibilidad — detonando upgrades de tier orgánicamente.

## Cómo funciona

1. **Google Sheet** con datos de listings (sintéticos en demo, API real en producción)
2. **Scorer IA** (Anthropic Claude vía n8n) evalúa cada listing en 5 dimensiones de calidad
3. **Dashboard dual** — vista pública (solo listings score >70) + vista interna (métricas de Growth)

## Stack

- **Frontend:** Next.js 14+ · TypeScript · Tailwind CSS
- **Datos:** Google Sheets API
- **IA:** Anthropic Claude API (vía n8n)
- **Deploy:** Vercel

## Roadmap

- [x] Estructura base + config portable
- [ ] Google Sheet con 50 listings sintéticos
- [ ] Scoring con n8n + Anthropic
- [ ] Dashboard público (vista Pincali)
- [ ] Dashboard interno (vista Growth)

---

> 🔄 **Migración a cuenta corporativa: <1 hora** · [ver MIGRATION.md](docs/MIGRATION.md)

---

Construido por [Francisco Franco Herrera Sánchez](https://www.linkedin.com/in/franco-herrera/) · [Franco Herrera Growth Lab](https://github.com/francoherrerasa-creator/franco-herrera-growth-lab)
