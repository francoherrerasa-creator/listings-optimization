# EasyBroker — Contexto Operativo

Resumen de mecánicas internas, políticas y API descubiertos durante investigación del help center y documentación pública (mayo 2026).

---

## Mecánicas Internas del Producto

### Bolsa Inmobiliaria
Sistema de compartición de inventario entre agentes/inmobiliarias dentro de EasyBroker. Permite que un agente promueva propiedades de otro y gane comisión. Requiere que los listings tengan `share_commission: true` y porcentaje definido.

### Pincali
Portal de búsqueda dirigido al consumidor final (compradores/renters). Es el "Zillow mexicano" de EasyBroker. Se alimenta directamente del inventario publicado en EasyBroker. Su calidad de contenido depende 100% de la calidad de los listings.

### Micrositios
Sitios web personalizados para cada inmobiliaria, generados automáticamente desde su inventario en EasyBroker. Son el equivalente a una landing page SEO por agente.

### Listas de propiedades
Feature que permite a agentes crear colecciones curadas de propiedades para enviar a prospectos. Depende de que el inventario esté bien categorizado y con datos completos para que los filtros funcionen.

---

## 7 Políticas Oficiales de Publicación

EasyBroker tiene un equipo de moderación humana que revisa anuncios con SLA de <48h. Estas son las políticas que validan:

| # | Política | Automatizable | Notas |
|---|----------|:---:|-------|
| 1 | No duplicados | Sí | Aunque tengan diferente ubicación o variantes |
| 2 | Inmuebles disponibles | Sí | No vendidos/rentados ya |
| 3 | No fraudulentos/engañosos | No | Requiere juicio humano |
| 4 | Imágenes promueven el inmueble | Sí | No renders, no fotos de otro inmueble |
| 5 | Precio y ubicación reales | Sí | No precios anzuelo ($1 MXN) |
| 6 | Características coincidentes | Sí | Lo descrito debe coincidir con lo real |
| 7 | Remates bancarios clasificados | No | Campo `foreclosure` debe estar correcto |

### Motivos de moderación automatizables
- Precio incorrecto
- Descripción con datos incorrectos
- Ubicación incorrecta
- No es inmueble real
- Duplicado
- No clasificado como remate

---

## Sistema de Moderación

- **Quién:** Equipo humano interno de EasyBroker
- **SLA:** Respuesta en menos de 48 horas hábiles
- **Trigger:** Cuando un listing incumple alguna de las 7 políticas
- **Acción:** Notificación al agente con motivo específico de rechazo
- **Pain point:** Es manual, no escala con el crecimiento del inventario

---

## API Pública

### Ambientes
| Ambiente | Base URL | Key |
|----------|----------|-----|
| Staging | `https://api.stagingeb.com` | `l7u502p8v46ba3ppgvj5y2aad50lb9` (pública) |
| Producción | `https://api.easybroker.com` | Privada por cuenta |

### Endpoints relevantes
- `GET /v1/properties` — Lista con paginación (limit, page, search filters)
- `GET /v1/properties/:public_id` — Detalle completo
- `POST /v1/properties` — Crear propiedad
- `PATCH /v1/properties/:public_id` — Actualizar propiedad

### Autenticación
- Header: `X-Authorization: <api_key>`
- Rate limit: 20 requests/segundo

### Datos del staging
- 1,437 propiedades de prueba
- Datos realistas (Monterrey, CDMX, etc.)
- Muchos campos null → excelente para probar scoring de completitud

---

## Recomendaciones del Help Center

EasyBroker publica guías de mejores prácticas para agentes:

1. **Título:** Formato "Tipo de propiedad + operación + ubicación"
2. **Descripción:** Concisa, detallando características importantes
3. **Fotos:** Al menos 10, ordenadas como recorrido del inmueble
4. **Amenidades:** Listar todas las aplicables
5. **Ubicación:** Precisa para aparecer en filtros de búsqueda
6. **IA:** Recomiendan explícitamente usar ChatGPT, Claude o Gemini para crear descripciones

---

## Lo que NO está documentado (huecos)

- No hay documentación pública sobre el algoritmo de ranking/visibilidad en Pincali
- No se documenta cómo afecta la calidad del listing al posicionamiento
- No hay API para consultar el estado de moderación de un listing
- No hay webhook para eventos de moderación
- No se documenta si existe scoring interno de calidad
- No hay API para comparar listings entre sí (detección de duplicados)

---

## Implicaciones para Growth Strategy

1. **El scorer replica lo que ya hacen manualmente** → No es invención, es automatización
2. **La API de staging permite demo real** → No necesitamos data sintética para impresionar
3. **Las políticas oficiales son nuestras dimensiones de scoring** → Alineación directa
4. **El equipo de moderación es el buyer interno** → Ellos son quienes sentirían el alivio operativo
5. **EasyBroker ya recomienda IA** → No hay resistencia cultural a la solución
6. **Los huecos en documentación son oportunidades** → Scoring de calidad + ranking son features que no tienen y podrían querer
