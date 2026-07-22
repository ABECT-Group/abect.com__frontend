import { NextResponse } from 'next/server'

const content = `# ABECT — Веб-агентство

> Розробка сайтів та запуск реклами для бізнесу

ABECT — українське веб-агентство, що спеціалізується на розробці сайтів та цифровому маркетингу для малого і середнього бізнесу.

## Що ми робимо

- Розробка landing page, корпоративних сайтів та інтернет-магазинів
- Два формати розробки: на конструкторі Weblium (швидко і доступно) та Custom (індивідуальна розробка на Next.js)
- Калькулятор вартості для онлайн-розрахунку проекту
- SEO-оптимізація та налаштування реклами

## Основні сторінки

- [Головна](https://agency.abect.com/)
- [Послуги](https://agency.abect.com/services)
- [Портфоліо](https://agency.abect.com/portfolio)
- [Блог](https://agency.abect.com/blog)
- [Калькулятор вартості](https://agency.abect.com/calculator)
- [Контакти](https://agency.abect.com/contacts)
- [Про нас](https://agency.abect.com/about)

## Технічна інформація

- Сайт побудований на Next.js 15 + Payload CMS 3
- Підтримує дві мови: українська (за замовчуванням) та англійська (/en)
- Sitemap: https://agency.abect.com/sitemap.xml
`

export function GET() {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
