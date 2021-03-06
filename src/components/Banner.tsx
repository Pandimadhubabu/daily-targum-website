import * as React from 'react';
import cn from 'classnames';
import Styles from './Banner.styles';
const { classNames, StyleSheet } = Styles;

export function Banner({
  text,
  accentText,
  legacy,
  className
}: {
  text: string
  accentText?: string
  legacy?: boolean
  className?: string
}) {
  return (
    <>
      <div 
        className={cn(
          classNames.logoWrap,
          className,
          {
            [classNames.legacy]: legacy
          }
        )} 
        role='banner'
        aria-label={`${text}${accentText ? ' '+accentText : ''}`}
        data-tooltip-position='none'
      >
        <h1 className={classNames.logo} aria-hidden={true}>
          {text}
          {accentText ? <span className={classNames.logoAccent}> {accentText}</span> : null}
        </h1>
      </div>
      {StyleSheet}
    </>
  );
}

export default Banner;