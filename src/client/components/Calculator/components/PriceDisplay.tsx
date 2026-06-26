'use client';

import { JSX, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCalculator } from '../CalculatorContext';
import './PriceDisplay.scss';

export default function PriceDisplay(): JSX.Element {
  const t = useTranslations('Calculator');
  const { state } = useCalculator();
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    if (state.estimatedPrice === displayPrice) return;

    const diff = state.estimatedPrice - displayPrice;
    const steps = 20;
    const stepValue = diff / steps;
    let current = displayPrice;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += stepValue;
      if (step >= steps) {
        setDisplayPrice(state.estimatedPrice);
        clearInterval(interval);
      } else {
        setDisplayPrice(Math.round(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [state.estimatedPrice, displayPrice]);

  const showPrice = !!(state.projectType && state.platform);

  return (
    <div className={`calculator-price ${showPrice ? 'calculator-price--visible' : ''}`}>
      <div className="calculator-price__inner">
        <div>
          <div className="calculator-price__label">{t('priceLabel')}</div>
          <div className="calculator-price__value">
            {state.config?.generalSettings.showPriceFrom && (
              <span className="calculator-price__from">{t('priceFrom')}</span>
            )}
            <span className="calculator-price__amount">
              {displayPrice.toLocaleString('uk-UA')}
            </span>
            <span className="calculator-price__currency">
              {state.config?.generalSettings.currency || t('currency')}
            </span>
          </div>
        </div>
        {state.estimatedTimeline && (
          <div className="calculator-price__timeline">
            <span className="calculator-price__timeline-label">{t('timelineLabel')}:</span>
            <span className="calculator-price__timeline-value">{state.estimatedTimeline}</span>
          </div>
        )}
      </div>
    </div>
  );
}
