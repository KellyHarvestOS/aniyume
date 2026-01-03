<div align="center">

  <!-- КОМПОЗИЦИЯ: ТЯНКА — ЛОГОТИП — ТЯНКА -->
  <table>
    <tr>
      <!-- Левый маскот -->
      <td align="right" valign="bottom" width="25%">
        <img src="https://github.com/user-attachments/assets/ac1a5892-f3cf-4d60-99c9-e5216260b69f" height="280" alt="Left Mascot" />
      </td>
      <!-- Логотип и описание по центру -->
      <td align="center" valign="middle" width="50%">
        <img src="https://github.com/user-attachments/assets/d7779d05-b096-4ffc-b7e5-830fdd0c62c6" width="100%" style="max-width: 450px;" alt="Aniyume Logo" />
        <br />
        <br />
        <b>Современная платформа для просмотра аниме.</b>
        <br />
        <sub>Адаптивный дизайн • Умный поиск • Гибкие фильтры</sub>
        <br />
        <br />
        <p>
          <img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white" />
          <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
          <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
        </p>
      </td>
      <!-- Правый маскот -->
      <td align="left" valign="bottom" width="25%">
        <img src="https://github.com/user-attachments/assets/d69861b3-a166-4b87-89fb-a5a9feeaa7c9" height="280" alt="Right Mascot" />
      </td>
    </tr>
  </table>

</div>

<br />

---

## <img src="https://api.iconify.design/heroicons/computer-desktop-solid.svg?color=%2321D0B8" width="28" height="28" style="vertical-align: middle; margin-bottom: 4px;" alt="icon" /> Обзор интерфейса

> **Примечание:** Проект находится в активной разработке.

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <b>Главная страница</b><br/>
        <img
          src="https://github.com/user-attachments/assets/cd2ef6cc-af4c-44de-8172-7d21fa3ec617"
          width="100%"
          alt="Главная страница"
        />
      </td>
      <td align="center" width="50%">
        <b>Страница просмотра</b><br/>
        <img
          src="https://github.com/user-attachments/assets/f5f9edd9-c5e4-4213-9076-036de6ce6741"
          width="100%"
          alt="Страница плеера"
        />
      </td>
    </tr>
  </table>
</div>


---

## <img src="https://api.iconify.design/heroicons/sparkles-solid.svg?color=%2321D0B8" width="28" height="28" style="vertical-align: middle; margin-bottom: 4px;" alt="icon" /> Основные возможности

### <img src="https://api.iconify.design/heroicons/film-solid.svg?color=%2321D0B8" width="24" height="24" style="vertical-align: middle; margin-bottom: 2px;" alt="icon" /> Просмотр и Навигация
*   **Умная лента:** Карусель новинок и топ-рейтинга с адаптивной версткой (React Slick).
*   **Мощный Плеер:** Поддержка выбора озвучки, автоматическое переключение серий, интеграция с Kodik.
*   **Каталог:** Пагинация, "ленивая" загрузка (Skeletons) и красивые карточки с эффектом Glassmorphism.

### <img src="https://api.iconify.design/heroicons/magnifying-glass-solid.svg?color=%2321D0B8" width="24" height="24" style="vertical-align: middle; margin-bottom: 2px;" alt="icon" /> Поиск и Фильтрация
*   **Live Search:** Мгновенный поиск с выпадающим списком и Debounce-защитой.
*   **Глубокий фильтр:** Сортировка по жанрам, годам, студиям, статусу (онгоинг/завершен) и вариантам озвучки.
*   **URL-синхронизация:** Все фильтры сохраняются в адресной строке — ссылкой можно поделиться.

### <img src="https://api.iconify.design/heroicons/calendar-days-solid.svg?color=%2321D0B8" width="24" height="24" style="vertical-align: middle; margin-bottom: 2px;" alt="icon" /> Утилиты
*   **Расписание:** Автоматическое распределение онгоингов по дням недели.
*   **Закладки:** Списки "Смотрю", "В планах", "Брошено" и т.д. (сохранение в LocalStorage / Cloud).
*   **Дизайн:** Фирменный цвет `#21D0B8`, темная тема плеера, адаптив под мобильные устройства.

---

## <img src="https://api.iconify.design/heroicons/cpu-chip-solid.svg?color=%2321D0B8" width="28" height="28" style="vertical-align: middle; margin-bottom: 4px;" alt="icon" /> Технический стек

| Категория | Технологии |
| :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | React Icons (Fa, Md, Hi), Heroicons |
| **Components** | React Slick, Headless UI concepts |
| **Architecture** | Server Components + Client Hooks |
| **API** | Custom API Proxy (Bypass CORS & Cloudflare) |

---

## <img src="https://api.iconify.design/heroicons/rocket-launch-solid.svg?color=%2321D0B8" width="28" height="28" style="vertical-align: middle; margin-bottom: 4px;" alt="icon" /> Быстрый старт

Этот проект использует проксирование запросов к внешнему API для обхода блокировок. Следуйте инструкции:

| Шаг | Действие | Команда / Инструкция |
| :---: | :--- | :--- |
| **1** | **Клонирование** | `git clone https://github.com/KellyHarvestOS/aniyume.git`<br>`cd aniyume` |
| **2** | **Зависимости** | `npm install`<br>*(или `yarn install`)* |
| **3** | **Настройка API** | Проверьте файл конфигурации API и настройте эндпоинты (при необходимости). |
| **4** | **Запуск** | `npm run dev` |
| **5** | **Готово!** | Откройте в браузере: [http://localhost:3000](http://localhost:3000) |

<br />

<div align="center">
  <sub>Designed with ❤️ by KellyHarvestOS and TamerlanWebd</sub>
</div>
