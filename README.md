# SMS PWA Application

This is a Progressive Web Application (PWA) designed to simulate SMS conversations. It provides a modern, app-like experience directly from the web, with capabilities such as offline access and installability on mobile devices.

## Features

*   Simulates SMS conversation threads.
*   Progressive Web App (PWA) capabilities for an app-like experience.
*   Responsive design for various screen sizes.
*   Configurable settings (e.g., appearance, user preferences).

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (which includes npm)
*   **npm** (Node Package Manager) or **Yarn**: (npm is installed with Node.js, Yarn can be installed via `npm install -g yarn`)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/VictorPaulArony/sms-simulator.git
cd sms-simulator
```

### 2. Install Dependencies

```bash
npm install
```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will start a development server, usually accessible at `http://localhost:5173/` (or similar). The application will automatically reload as you make changes to the source code.

## Build for Production (PWA)

To build the application for production, which includes generating all PWA assets (manifest, service worker, etc.) and optimizing the code:

```bash
npm run build
```

This command will create a `dist` folder in the project root, containing all the static files ready for deployment. This folder is optimized for performance and includes the necessary files to function as a PWA.

## Preview Production Build

You can locally preview the production build to ensure everything works as expected before deployment:

```bash
npm run preview
```

This will serve the contents of the `dist` folder, allowing you to test the PWA features in a production-like environment.

## PWA Capabilities & Deployment

This application is configured as a Progressive Web App. After building for production, it can be installed on mobile devices and provides features like offline support.

For detailed instructions on how to deploy this PWA to a live web server (e.g., Vercel, Netlify) and how users can install it on their Android and iOS devices, please refer to the `PWA_Deployment_and_Installation.md` file in this repository.
