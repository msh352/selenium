# 🧪 Facephi QA Automation Suite

Automatización de pruebas end-to-end desarrollada con **Cucumber JS**, **Selenium WebDriver 4** y **Page Object Model (POM)**.  

---

## 📋 Requisitos previos

Antes de clonar o ejecutar el proyecto asegúrate de tener:

- **Node.js ≥ 20**
- **npm ≥ 9**
- **Google Chrome** instalado y actualizado
- **JavaScript ES6+** habilitado en tu entorno
- **Sistema operativo compatible:** Windows, macOS o Linux
- 
---

## 🛠 Instalación y configuración

1. Clona el repositorio:

   ```bash
   git clone <URL_DEL_REPO>
   cd facephi-tests
   
2. Instala dependencias:

   ```bash
   npm install

3. (Opcional) Verifica la versión de Node:

   ```bash
   node -v

4. Ejecuta los tests:

   ```bash
   npm test
   
5. (Opcional) Ejecutar con reporte HTML automático:

   ```bash
   npm run test:report

### 📁 Archivos generados

- `reports/report.json` → Raw execution output from Cucumber
- `reports/cucumber-report.html` → Human-readable HTML report (overwritten on every run)
- `reports/screenshots/*.png` → Screenshots automatically captured for failed scenarios

## 🧩 Estructura del proyecto

📦 facephi-tests
┣ 📁 features
┃ ┣ home_navigation.feature
┃ ┣ contact_form.feature
┃ ┗ ...
┣ 📁 pageObjects
┃ ┣ HomePage.js
┃ ┣ ContactPage.js
┃ ┗ ...
┣ 📁 step_definitions
┃ ┣ home_steps.js
┃ ┣ contact_steps.js
┃ ┣ common_steps.js       ← Steps reutilizables (URL, título, esperas)
┣ 📁 support
┃ ┣ driver.js
┃ ┣ hooks.js              ← Hooks Before/After con screenshots en fallo
┃ ┗ config.js             ← Parámetros globales
┣ 📁 reports
┃ ┗ cucumber-report.html  ← Reporte generado tras la ejecución
┣ .prettierrc             ← Configuración de formato
┣ cucumber.js             ← Configuración de Cucumber
┗ package.json

## 🧱 Arquitectura del proyecto

Cucumber + Gherkin: define los escenarios en lenguaje natural (.feature).

Selenium WebDriver 4: ejecuta la automatización en un navegador real (Chrome).

Page Object Model (POM): organiza los localizadores y acciones por página.

Hooks y Screenshots: captura pantallazos automáticos en caso de fallo.

Prettier: mantiene formato y estilo consistente en todo el código.