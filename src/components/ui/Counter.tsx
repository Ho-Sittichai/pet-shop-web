'use client';

import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  end,
  start = 0,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className}>
        {prefix}
        {end.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </span>
    );
  }

  return (
    <span className={className}>
      <CountUp
        start={start}
        end={end}
        duration={duration}
        decimals={decimals}
        separator={separator}
        prefix={prefix}
        suffix={suffix}
        preserveValue
      />
    </span>
  );
};
