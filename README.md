# Evaluación Técnica Devsu - Productos Financieros

Este proyecto es una aplicación web desarrollada en **Angular 18** para la gestión del catálogo de productos financieros. Implementa una arquitectura moderna utilizando Standalone Components, estado reactivo con Signals y Formularios Reactivos con validaciones asíncronas.

## Requisitos Previos (Entorno)

Para garantizar la compatibilidad y el correcto funcionamiento del proyecto, es necesario contar con las siguientes versiones instaladas en el entorno local:

- **Node.js**: `v20.11.1` (Versión específica requerida para utilizar correctamente Angular 18).
- **pnpm**: `v9.15.9` (Gestor de paquetes utilizado a lo largo de todo el desarrollo).

### Instalación de Herramientas Globales
Si no cuentas con estas herramientas en las versiones indicadas, puedes instalarlas globalmente ejecutando:
1. **Instalar pnpm (v9.15.9):**  
   npm install -g pnpm@9.15.9  
2. **Instalar Angular CLI (v18):**  
   npm install -g @angular/cli@18  
   (Alternativa usando pnpm: pnpm add -g @angular/cli@18)

### Instalación de Librerías y Configuración  
Una vez preparado el entorno, sigue estos pasos para instalar el proyecto:  

Clonar el repositorio e ingresar a la carpeta:  

git clone <url-del-repositorio>  
cd productos-financieros-assessment  

Instalar las dependencias:  
Utiliza el siguiente comando para instalar todas las librerías necesarias de Angular de forma optimizada:  
pnpm install

### Ejecución del Proyecto  
Para levantar el servidor de desarrollo del Frontend, ejecuta:  
pnpm run start  

###  Pruebas Unitarias y Reporte de Cobertura (Coverage)  
pnpm exec ng test --code-coverage --watch=false
