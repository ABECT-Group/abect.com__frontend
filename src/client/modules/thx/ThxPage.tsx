'use client';

import { JSX } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/client/i18n/navigation';
import './ThxPage.scss';

interface ThxPageProps {
  form: 'simple' | 'calculator';
}

export default function ThxPage({ form }: ThxPageProps): JSX.Element {
  const t = useTranslations('ThxPage');

  const subtitle = form === 'calculator' ? t('subtitleCalculator') : t('subtitleSimple');
  const steps = t.raw('steps') as Array<{ title: string; description: string }>;

  return (
    <section className="thx-page">
      <div className="container">
        <div className="thx-page__wrapper">
          <span className="thx-page__badge">{t('badge')}</span>

          <div className="thx-page__icon" aria-hidden="true">
            <CheckCircle strokeWidth={1.5} />
          </div>

          <h1 className="thx-page__title">{t('title')}</h1>
          <p className="thx-page__subtitle">{subtitle}</p>

          <div className="thx-page__steps">
            <p className="thx-page__steps-title">{t('stepsTitle')}</p>
            <ol className="thx-page__steps-list">
              {steps.map((step, i) => (
                <li key={i} className="thx-page__step">
                  <span className="thx-page__step-num">{i + 1}</span>
                  <div className="thx-page__step-body">
                    <strong className="thx-page__step-title">{step.title}</strong>
                    <span className="thx-page__step-desc">{step.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="thx-page__actions">
            <Link href="/" className="cta">
              {t('home')}
            </Link>
            <Link href="/services" className="cta cta-secondary">
              {t('services')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
