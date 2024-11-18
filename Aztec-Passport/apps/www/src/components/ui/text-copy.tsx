'use client';

/* eslint-disable no-nested-ternary -- allow nested */
import React, {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react';

import { cn, errorHandler, truncate } from '~/lib/utils';

import { useCopyToClipboard } from 'usehooks-ts';

import { Button, type ButtonProps } from './button';

import {
  CircleCheck,
  CopyIcon,
  Eye,
  EyeOff,
  type LucideProps,
} from 'lucide-react';

const TextCopyContext = createContext<{
  toCopy?: string;
  type?: 'text' | 'password';
  truncateOptions?: {
    enabled?: boolean;
    length?: number;
    fromMiddle?: boolean;
  };
  hidden: boolean;
  setHidden: (value: boolean) => void;
}>({
  toCopy: '',
  hidden: false,
  type: 'text',
  truncateOptions: {
    enabled: true,
    length: 20,
    fromMiddle: true,
  },
  setHidden: () => {
    return null;
  },
});

interface TextCopyProps extends ComponentProps<'div'> {
  toCopy?: string;
  type?: 'text' | 'password';
  truncateOptions?: {
    enabled?: boolean;
    length?: number;
    fromMiddle?: boolean;
  };
}

type TextCopyContentProps = ComponentProps<'div'>;

interface TextCopyEyeProps extends ButtonProps {
  iconProps?: LucideProps;
}

interface TextCopyButtonProps extends ButtonProps {
  canCopy?: boolean;
  iconProps?: LucideProps;
}

export const TextCopy = forwardRef<HTMLDivElement, TextCopyProps>(
  ({ children, className, toCopy, type, truncateOptions, ...props }, ref) => {
    const [hidden, setHidden] = useState<boolean>(false);
    return (
      <TextCopyContext.Provider
        value={{
          hidden,
          setHidden,
          toCopy,
          type,
          truncateOptions,
        }}
      >
        <div
          ref={ref}
          className={cn('flex flex-row items-center gap-2', className)}
          {...props}
        >
          {children}
        </div>
      </TextCopyContext.Provider>
    );
  }
);

export const TextCopyContent = forwardRef<HTMLDivElement, TextCopyContentProps>(
  ({ className, ...props }, ref) => {
    const { hidden, type, truncateOptions, toCopy } =
      useContext(TextCopyContext);
    return (
      <div className={cn('font-medium', className)} {...props} ref={ref}>
        {type === 'text'
          ? truncateOptions?.enabled
            ? truncate(toCopy ?? '', length, truncateOptions.fromMiddle)
            : toCopy
          : hidden
            ? '*'.repeat(24)
            : truncateOptions?.enabled
              ? truncate(toCopy ?? '', length, truncateOptions.fromMiddle)
              : toCopy}
      </div>
    );
  }
);

export const TextCopyEye = forwardRef<HTMLButtonElement, TextCopyEyeProps>(
  ({ iconProps = { size: 16, strokeWidth: 2.5 }, ...props }, ref) => {
    const { hidden, setHidden } = useContext(TextCopyContext);
    return (
      <Button
        className='h-8 w-8 p-0'
        variant='ghost'
        onClick={() => setHidden(!hidden)}
        {...props}
        ref={ref}
      >
        {hidden ? <EyeOff {...iconProps} /> : <Eye {...iconProps} />}
      </Button>
    );
  }
);

export const TextCopyButton = forwardRef<
  HTMLButtonElement,
  TextCopyButtonProps
>(({ iconProps = { strokeWidth: 2.5 }, canCopy = true, ...props }, ref) => {
  const { toCopy } = useContext(TextCopyContext);
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = async () => {
    try {
      await copy(toCopy ?? '');
      setCopied(true);
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    if (copied) {
      const id = setTimeout(() => {
        setCopied(false);
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [copied]);

  return (
    <>
      {canCopy ? (
        <Button
          className='h-8 w-8 p-0'
          variant='ghost'
          onClick={copyText}
          {...props}
          ref={ref}
        >
          {copied ? (
            <CircleCheck size={16} {...iconProps} />
          ) : (
            <CopyIcon size={16} {...iconProps} />
          )}
        </Button>
      ) : null}
    </>
  );
});

TextCopy.displayName = 'TextCopy';
TextCopyContent.displayName = 'TextCopyContent';
TextCopyEye.displayName = 'TextCopyEye';
TextCopyButton.displayName = 'TextCopyButton';
