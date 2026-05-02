# Scoring Rationale — Por qué cada dimensión existe

Este documento explica el razonamiento detrás de cada dimensión del scorer y cómo se alinea a las políticas oficiales de EasyBroker.

---

## Premisa

EasyBroker ya tiene un equipo humano que modera listings con SLA de 48h. Nuestro scorer automatiza ese proceso evaluando las mismas políticas que ellos validan manualmente, más criterios de calidad que mejoran la experiencia del buscador en Pincali.

---

## Dimensiones de Scoring

### 1. description_quality (peso: 25%)

**Política alineada:** #6 (Características descritas deben coincidir con el inmueble real)

**Qué evalúa:**
- ¿La descripción detalla características importantes del inmueble?
- ¿Sigue el formato recomendado por EasyBroker (concisa, sin datos de contacto)?
- ¿Diferencia este inmueble de otros similares?

**Por qué el peso más alto:** La descripción es el contenido indexable por Pincali/Google y lo primero que lee un prospecto. Una descripción genérica o vacía reduce visibilidad orgánica y tasa de conversión a lead.

**Método:** Evaluación con LLM (Claude) usando criterios del help center de EasyBroker.

---

### 2. price_plausibility (peso: 20%)

**Política alineada:** #5 (Precio y ubicación deben ser reales)

**Qué evalúa:**
- ¿El precio es coherente con el tipo de propiedad y ubicación?
- ¿Hay señales de precio anzuelo ($1 MXN, $100 MXN)?

**Por qué este peso:** Precios falsos violan políticas y destruyen confianza del comprador. Es uno de los motivos más frecuentes de moderación manual.

**Método (v1):** Score neutral (50) — requiere datos de mercado comparativos para análisis real. Detecta solo precios obviamente fraudulentos (<$100 MXN).

**Roadmap:** Integrar datos de mercado por zona/tipo para comparación estadística.

---

### 3. data_completeness (peso: 20%)

**Política alineada:** #4 y #6 (imágenes deben promover el inmueble + características coincidentes)

**Qué evalúa:**
- ¿Cuántos campos del listing están completos vs null?
- ¿Tiene fotos suficientes (recomendación: ≥10)?
- ¿Tiene amenidades listadas?
- ¿Tiene ubicación precisa (calle, CP, coordenadas)?

**Por qué este peso:** Un listing incompleto no aparece en filtros de búsqueda (si falta bedrooms, no sale cuando buscan "3 recámaras"). Cada campo null es un filtro que el listing no puede pasar.

**Método:** Cálculo determinístico. Cuenta campos presentes / campos esperados. No requiere LLM.

---

### 4. photos_signal (peso: 20%)

**Política alineada:** #4 (Las imágenes deben promover el inmueble)

**Qué evalúa:**
- ¿Tiene al menos 10 fotos? (recomendación oficial)
- ¿Las fotos parecen cubrir el inmueble completo (recorrido)?
- ¿Son fotos del inmueble real (no renders genéricos)?

**Por qué este peso:** EasyBroker recomienda explícitamente "al menos 10 fotos ordenadas como recorrido". Los listings con más/mejores fotos generan más leads. Es la señal visual más inmediata de calidad.

**Método:** Evaluación con LLM basada en metadata (cantidad, títulos). No analiza contenido visual de imágenes en v1.

**Roadmap:** Integrar visión por computadora para evaluar calidad fotográfica real.

---

### 5. location_clarity (peso: 15%)

**Política alineada:** #5 (La ubicación debe ser real y verificable)

**Qué evalúa:**
- ¿La ubicación permite aparecer en filtros de búsqueda correctos?
- ¿Tiene colonia, ciudad, estado completos?
- ¿Tiene coordenadas GPS?
- ¿El título incluye la ubicación (formato recomendado)?

**Por qué el peso menor:** Es importante pero es binaria: o la ubicación es correcta o no. Tiene menos gradientes de calidad que descripción o fotos.

**Método:** Evaluación con LLM combinada con verificación de campos de ubicación presentes.

---

## Policy Alignment

Además del score numérico, el sistema evalúa cumplimiento explícito de cada política oficial:

| Política | Método de validación |
|----------|---------------------|
| No duplicados | Comparación con otros listings (futuro) |
| Disponibilidad | Si está en API, se asume disponible |
| No fraudulento | Requiere revisión humana (flag) |
| Imágenes | Cantidad + evaluación LLM |
| Precio/ubicación | Detección de anomalías + coordenadas |
| Características | Requiere visión computadora (futuro) |
| Remates | Campo `foreclosure` + flag si ambiguo |

---

## Flags de Moderación

Cuando el scorer detecta algo que requiere atención humana, genera flags específicos. Estos son análogos a los motivos que hoy usa el equipo de moderación:

- "Precio sospechosamente bajo" → Motivo: precio incorrecto
- "Sin descripción" → Motivo: descripción con datos incorrectos
- "Ubicación incompleta" → Motivo: ubicación incorrecta
- "0 fotos" → Motivo: imágenes no promueven el inmueble

---

## Threshold: ¿Por qué 70?

Un listing con score ≥70 cumple razonablemente con las políticas y mejores prácticas. Debajo de 70, tiene deficiencias significativas que afectan su rendimiento en búsqueda y conversión a lead.

El threshold es configurable en `lib/config.ts` y podrá ajustarse con datos reales de correlación score↔conversión cuando se tenga acceso a analytics de leads.
