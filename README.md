# Kpop Fan Community Frontend

This is the frontend application for the Kpop Fan Community. It is built using React and Bootstrap.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/M-Julius/kpop-fan-frontend.git
    cd kpop-fan-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Update a `src/services/api.js` file in the directory and update the variabel with your HOST api
    ```plaintext
    export const HOST = "http://127.0.0.1:3000"
    ```

4. Start the development server:
    ```bash
    npm start
    ```

### Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm test`: Launches the test runner in the interactive watch mode.

### Features

- **Homepage**: 
  - Banner slider with event images.
  - List of bands with their logos.
  - List of upcoming schedules.

- **Band Detail Page**:
  - Display band details, members, playlist, and photos in a carousel.

- **Event Detail Page**:
  - Display event details, date, band, and photos in a carousel.

- **CMS Dashboard**:
  - Manage bands, events, schedules, and users with create, update, and delete functionalities.

### License

This project is licensed under the MIT License.
