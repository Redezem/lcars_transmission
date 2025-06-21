
# LCARS Transmission Dashboard

A web-based dashboard for the Transmission BitTorrent daemon, styled after the LCARS interface from Star Trek: The Next Generation. Built with Vite, Vue 3, TypeScript, and Docker.

## Features

*   **View Torrents:** See a list of all your torrents with current status, progress, speed, ETA, and size.
*   **LCARS Interface:** Enjoy a nostalgic Star Trek TNG-themed user interface.
*   **Real-time Updates:** Torrent list automatically refreshes every 5 seconds.
*   **Dockerized Deployment:** Easy to deploy using Docker and Docker Compose.
*   **Host Network Integration:** Designed to connect to a Transmission daemon running on the host system.

## Prerequisites

*   **Docker and Docker Compose:** Must be installed on your system.
*   **Transmission Daemon:** A Transmission daemon (version 2.80+ recommended for full RPC feature compatibility) must be running on the **host machine**.
*   **Transmission RPC Enabled:**
    *   Ensure RPC is enabled in Transmission's settings (usually `settings.json` or via its Web UI if accessible).
    *   The default RPC port is `9091`.
    *   **Important for `network_mode: "host"`:** The Transmission daemon should be configured to allow RPC requests from `localhost` or `127.0.0.1` as the dashboard container will access it via the host's network stack. If you have an RPC whitelist enabled, ensure `127.0.0.1` is on it.

## Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd transmission-dashboard
    ```

2.  **Configure Transmission (Host):**
    *   Open Transmission's `settings.json` file. (Location varies by OS, e.g., `~/.config/transmission-daemon/settings.json` on Linux).
    *   Ensure `"rpc-enabled": true`.
    *   Ensure `"rpc-port": 9091` (or your custom port, which you'll need to adjust if different).
    *   If `"rpc-whitelist-enabled": true`, make sure `"rpc-whitelist"` includes `"127.0.0.1"`.
    *   Restart the Transmission daemon after making changes.

3.  **Build and Run with Docker Compose:**
    From the project's root directory (`transmission-dashboard`):
    ```bash
    docker-compose up -d --build
    ```
    This command will:
    *   Build the Docker image for the dashboard application.
    *   Start a container in detached mode (`-d`).
    *   The application will be accessible via the host's network due to `network_mode: "host"`.

4.  **Access the Dashboard:**
    Open your web browser and navigate to:
    `http://localhost:8080`

    (This assumes Nginx inside the container is running on port 8080, as configured in `nginx.conf` and `Dockerfile`, and `network_mode: "host"` makes this port directly available on the host.)

## LCARS Interface

The application is styled using a CSS framework inspired by the LCARS (Library Computer Access/Retrieval System) interface prominent in Star Trek: The Next Generation. This provides a unique and thematic way to view your torrents.

## Development (Optional)

If you want to run the application in development mode (with Vite's hot-reloading):

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Vite Dev Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy). The Vite dev server includes a proxy to `http://localhost:9091/transmission/rpc` (configurable in `vite.config.ts`).

## Technology Stack

*   **Frontend:** Vue 3 with TypeScript
*   **Build Tool:** Vite
*   **Styling:** LCARS-inspired CSS
*   **Containerization:** Docker
*   **Orchestration:** Docker Compose
*   **Web Server (in Docker):** Nginx

## Troubleshooting

*   **Port Conflicts (Docker):** If port `8080` is already in use on your host when using `docker-compose up`, the dashboard container may not start correctly. You can either stop the conflicting service or modify the `ports` mapping in `docker-compose.yml` (e.g., `"8081:8080"`) AND update the Nginx listen port in `nginx.conf` and the `EXPOSE` directive in the `Dockerfile` accordingly. Remember that `network_mode: "host"` means the container attempts to bind directly to the host's port.
*   **Transmission Connection Issues:**
    *   Verify Transmission is running on the host.
    *   Check `rpc-whitelist` settings in Transmission if enabled.
    *   Ensure the RPC port is correct (default `9091`).
    *   Browser console logs might show network errors if the frontend cannot reach the Transmission RPC endpoint.
