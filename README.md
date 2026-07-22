# ABECT

Корпоративний сайт веб-агентства з інтерактивним калькулятором вартості, портфоліо, блогом та CMS.

## Стек

- **Next.js 15** — React фреймворк, App Router, SSG + on-demand revalidation
- **Payload CMS 3** — Headless CMS, адмін-панель
- **React 19** — UI
- **MongoDB** — база даних
- **TypeScript** — мова програмування
- **next-intl** — локалізація (UA / EN)
- **Docker + Nginx** — деплой

## Що вміє сайт

- **Каталог послуг** з двома ціновими моделями: Weblium (конструктор) і Custom (індивідуальна розробка)
- **Калькулятор вартості** — 6-крокова форма з динамічним розрахунком ціни
- **Портфоліо** проектів
- **Блог** з категоріями, тегами та коментарями (з модерацією)
- **Збір заявок** з форм + автоматичні сповіщення в Telegram
- **CMS** для управління всім контентом через адмін-панель

## Колекції Payload CMS

| Колекція | Призначення |
|---|---|
| Users | Адміністратори та модератори |
| Media | Завантажені файли та зображення |
| Posts | Статті блогу |
| Categories | Категорії блогу |
| Comments | Коментарі до статей (з модерацією) |
| ServiceTypes | Категорії послуг |
| Services | Послуги (Weblium / Custom ціноутворення) |
| Portfolio | Портфоліо проектів |
| Leads | Заявки з сайту (форма + калькулятор) |

**Глобал:** `CalculatorConfig` — налаштування калькулятора (типи проектів, ціни, опції).

## Локальна розробка

### Вимоги

- Node.js 18.20.2+ або 20.9.0+
- npm 10+
- MongoDB Atlas (хмарний) або локальний MongoDB

### Встановлення

```bash
npm install

cp .env.example .env
# Заповніть DATABASE_URI, PAYLOAD_SECRET тощо

npm run dev
```

Відкрийте http://localhost:3000 — сайт, http://localhost:3000/admin — CMS.

### Команди

```bash
npm run dev              # Dev сервер
npm run build            # Production білд
npm run start            # Production сервер

npm run generate:types   # TypeScript типи Payload
npm run generate:importmap

npm run test             # Всі тести (unit + e2e)
npm run test:int         # Unit/integration тести (Vitest)
npm run test:e2e         # E2E тести (Playwright)
npm run lint             # ESLint

npm run seed:services        # Seed базових послуг
npm run seed:services:extra  # Seed додаткових послуг
```

## Деплой на VPS

Інструкція деплою: [`../docs/VPS.md`](../docs/VPS.md)

Nginx конфіг: [`../docs/agency.abect.com.conf`](../docs/agency.abect.com.conf)

### Швидкий редеплой

```bash
/home/admin/www/abect/scripts/restart.sh
```

Скрипт: `git pull` → зупинка контейнера → збірка → запуск. Білд займає ~5 хв.

### Структура на сервері

```
/home/admin/www/abect/
├── .env.db           # MongoDB credentials
├── .env.frontend     # App env vars
├── frontend/         # git clone цього репо
├── mongodb/          # Docker Compose для MongoDB
└── scripts/          # restart.sh, backup.sh
```

### Бекап MongoDB

```bash
/home/admin/www/abect/scripts/backup.sh
# Зберігає: /home/admin/www/abect/mongodb/backups/abect_YYYYMMDD_HHMMSS.gz
```

## Змінні оточення

### `.env` (локально, з `.env.example`)

```
DATABASE_URI=mongodb+srv://user:password@cluster.mongodb.net/abect
PAYLOAD_SECRET=згенеруй_openssl_rand_-base64_32
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_THREAD_ID=
```

### На VPS — два файли

**`.env.db`**
```
MONGO_ROOT_USER=
MONGO_ROOT_PASSWORD=
DATABASE_URI=mongodb://user:password@abect-mongo:27017/abect?authSource=admin
```

**`.env.frontend`**
```
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=https://agency.abect.com
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_THREAD_ID=
NEXT_TELEMETRY_DISABLED=1
```

## Структура проекту

```
frontend/
├── src/
│   ├── app/
│   │   ├── (frontend)/[locale]/   # Публічні сторінки
│   │   └── (payload)/admin/       # Payload адмін-панель
│   ├── client/
│   │   ├── components/            # Header, Footer, Calculator тощо
│   │   ├── modules/               # Модулі сторінок
│   │   └── lib/                   # Запити до Payload API
│   ├── collections/               # Конфігурація колекцій Payload
│   ├── globals/                   # CalculatorConfig
│   ├── scripts/                   # Seed-скрипти
│   └── payload.config.ts
├── messages/
│   ├── ua.json                    # Українські переклади
│   └── en.json                    # Англійські переклади
├── Dockerfile
├── docker-compose.yml
└── .env.example
```
