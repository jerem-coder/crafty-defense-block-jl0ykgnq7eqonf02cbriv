# Crafty Defense: Blockade

A Minecraft-inspired tower defense game where you build blocky towers to defend against waves of playful, pixelated monsters.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jerem-coder/crafty-defense-blockade)

## About The Project

Crafty Defense: Blockade is a visually charming tower defense game inspired by the blocky, creative aesthetic of Minecraft. Players are tasked with defending their base against waves of whimsical, 2D-animated monsters. The core gameplay involves strategically placing various types of defensive towers on a grid-based map. Each tower has unique abilities and can be upgraded using 'Blocks', the in-game currency earned by defeating enemies.

The user interface is designed to be intuitive and delightful, with a 'Kid Playful' art style featuring bright colors, rounded shapes, and clean, stylized illustrations, making it accessible and engaging for all ages.

## Key Features

-   **Strategic Tower Defense Gameplay:** Place and upgrade a variety of unique towers to fend off enemy waves.
-   **Minecraft-Inspired Aesthetics:** Enjoy a charming, blocky visual style with custom pixel fonts and vibrant colors.
-   **Engaging Enemy Waves:** Defend against progressively challenging waves of whimsical 2D monsters.
-   **Resource Management:** Earn 'Blocks' by defeating enemies and use them to build and upgrade your defenses.
-   **Intuitive UI:** A clean and simple interface makes it easy to manage your towers and control the game flow.
-   **Responsive Design:** The game is fully playable on both desktop and mobile devices, with the UI adapting for smaller screens.

## Technology Stack

This project is built with a modern, high-performance tech stack:

-   **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/crafty-defense-blockade.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd crafty-defense-blockade
    ```
3.  Install dependencies:
    ```sh
    bun install
    ```

### Running the Development Server

To start the local development server, run the following command:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view the application in your browser.

## Available Scripts

-   `bun run dev`: Starts the development server with hot-reloading.
-   `bun run build`: Creates a production-ready build of the application.
-   `bun run lint`: Lints the codebase to check for errors and style issues.
-   `bun run deploy`: Deploys the application to Cloudflare Workers.

## Deployment

This project is configured for seamless deployment to the Cloudflare global network using Wrangler.

### One-Click Deploy

You can deploy this project to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jerem-coder/crafty-defense-blockade)

### Manual Deployment

1.  **Build the project:**
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    Follow the prompts after running the deploy command. You will need to be logged into your Cloudflare account via the Wrangler CLI.
    ```sh
    bun run deploy
    ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.