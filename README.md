# Fix Your Home — Home-services Marketplace

A team-built home-services application with customer, worker and admin flows. The backend exposes registration, login, job requests, worker applications, job-status updates and worker-discovery endpoints.

## Technology
PHP 8.2+, Laravel 12, Sanctum, React, TypeScript, Vite and Tailwind CSS.

## Repository guide
| Path | Purpose |
| --- | --- |
| [routes/api.php](routes/api.php) | API routes and Sanctum-protected route group |
| [app/](app/) | Controllers and models |
| [Fix_Your_Home-react/](Fix_Your_Home-react/) | Separate React interface |
| [resources/](resources/) | Laravel front-end resources |
| [database/](database/) | Database migrations and seeders |
| [DB_SQL_file/](DB_SQL_file/) | Existing database export |
| [tests/](tests/) | Existing tests |

## Run locally
1. Install PHP, Composer and Node.js.
2. Run `composer install` and `npm install` in the repository root.
3. Copy `.env.example` to `.env` and configure a local database.
4. Run `php artisan key:generate`, then `php artisan migrate`.
5. Run `composer run dev`.
6. To run the separate interface, open `Fix_Your_Home-react/`, run `npm install`, then `npm run dev`. Set its API URL to your local backend.

Use migrations or inspect the existing database export before choosing an import strategy. Do not import over an existing database without a backup.

## Checks
`composer test`, `npm run types`, `npm run format:check` and `npm run build` are available in the project scripts.

## Collaboration
This repository is a fork of [Dazy9D/Fix_Your_Home](https://github.com/Dazy9D/Fix_Your_Home). Credit belongs to the project contributors; this portfolio entry represents Rudra Joyti Maitra Soham's participation in the team project.
