# Yuubin

Yuubin is a powerful and user-friendly API client desktop application, similar to Postman, that allows you to create, manage, and test HTTP requests. Unlike some other API clients, Yuubin stores all collection and request data locally on your computer in files, ensuring your data remains private and secure. Yuubin is built using Tauri, making it lightweight and fast.

## Features

- **Local Data Storage:** All your collections, requests and configs are stored locally on your computer in files, ensuring your data remains private and secure.
- **User-Friendly Interface:** An intuitive and easy-to-use interface for creating, managing, and testing HTTP requests.
- **Request Collections:** Organize your requests into collections for better management and ease of access.
- **Customizable Requests:** Create and customize HTTP requests with various methods (GET, POST, PUT, DELETE, etc.), headers, and body parameters.
- **Response Viewing:** View detailed responses, including status codes and response bodies. (Response headers currently in development)
- **Customizable UI:** Switch between dark and light themes, and choose between Japanese and English language options.

## Installation

To install Yuubin, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/JackMartinDev/Yuubin.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Yuubin
    ```
3. Install the dependencies:
    ```bash
    yarn install
    ```
4. Build the Tauri application:
    ```bash
    yarn tauri build
    ```

## Usage

1. Start the application:
    ```bash
    yarn tauri dev
    ```
2. Yuubin will open as a desktop application.

## Getting Started

1. **Creating a New Collection:**
   

2. **Creating a new Request:**


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by Postman.
- Built using [Tauri](https://tauri.app/).
