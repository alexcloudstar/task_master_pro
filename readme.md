# Task Master Pro

Task Master Pro is a comprehensive task management application designed to streamline project management and improve productivity. Built with ExpressJS, Docker, React, Typescript, Shadcn and many more, this application offers an intuitive user interface and robust backend functionality.

## Features

- User authentication and project management
- Task creation, assignment, and tracking
- Asset management for project resources
- Real-time updates and notifications

## Frontend

The frontend of Task Master Pro is built with React and TypeScript, utilizing several packages for enhanced functionality and styling.

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Packages

The frontend uses the following packages:
- `@clerk/clerk-react`
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@radix-ui/react-*`
- `@tanstack/react-query`
- `@tanstack/react-router`
- `@tanstack/react-table`
- `lucide`
- `lucide-react`
- `react`
- `react-cookie`
- `react-dom`
- `react-hook-form`
- `react-modal-image`
- `sonner`
- `tailwind-merge`
- `tailwindcss-animate`
- `uuid`
- `zod`

## Backend

The backend of Task Master Pro is built with Express and TypeScript, and it uses Docker for containerization and environment variables for configuration. Additionally, unit tests are implemented using Vitest.

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Docker

The backend uses Docker for containerization. The `docker-compose.yml` file includes configurations for the application and a PostgreSQL database.

```yaml
services:
  app:
    depends_on:
      - postgresdb
    build: ./
    restart: unless-stopped
    env_file: ./.env
    ports:
      - 8000:8000
    environment:
      - DB_HOST=$DB_HOST
      - DB_PORT=$DB_PORT
      - DB_USER=$DB_USER
      - DB_PASSWORD=$DB_PASSWORD
      - DB_NAME=$DB_NAME
      - NODE_ENV=development
    stdin_open: true
    tty: true
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
  postgresdb:
    image: postgres
    restart: unless-stopped
    env_file: ./.env
    environment:
      - DB_USER=$DB_USER
      - DB_PASSWORD=$DB_PASSWORD
      - DB_NAME=$DB_NAME
      - POSTGRES_HOST_AUTH_METHOD=trust
    ports:
      - $DB_PORT:$DB_PORT
    volumes:
      - db:/var/lib/postgresql/data/

volumes: 
  db:
```

### Environment Variables

The backend uses the following environment variables, configured in the `.env` file:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `NODE_ENV`
- `CLERK_SECRET_KEY`
- `CLERK_PUBLIC_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET`

### Packages

The backend uses the following packages:
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `@clerk/clerk-sdk-node`
- `cors`
- `dotenv`
- `drizzle-orm`
- `express`
- `jwt-decode`
- `multer`
- `pg`

### Unit Testing

Unit tests are implemented using Vitest. You can run the tests with the following command:
```bash
npm run test
```

## Contributing

We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

For detailed contribution guidelines, please refer to the CONTRIBUTING.md file (coming soon).

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgements

- [TanStack Router](https://tanstack.com/router) for routing solutions.
- [Clerk](https://clerk.dev/) for authentication.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Lucide Icons](https://lucide.dev/) for icons.

## Contact

If you have any questions or suggestions, feel free to open an issue or reach out to the project maintainer at [alexcloudstar](https://github.com/alexcloudstar).

---

[View the project on GitHub](https://github.com/alexcloudstar/task_master_pro)
