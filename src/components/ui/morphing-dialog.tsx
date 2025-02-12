'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Transition,
  Variant,
} from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import useClickOutside from '@/hooks/use-click-outside';
import { XIcon } from 'lucide-react';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      'useMorphingDialog must be used within a MorphingDialogProvider'
    );
  }
  return context;
}

type MorphingDialogProviderProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialogProvider({
  children,
  transition,
}: MorphingDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  );

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialog({ children, transition = {
  type: "spring",
  bounce: 0,
  duration: 0.2,
  stiffness: 300,
  damping: 30
} }: MorphingDialogProps) {
  return (
    <MorphingDialogProvider>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogProvider>
  );
}

type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  triggerRef?: React.RefObject<HTMLDivElement>;
};

function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingDialog();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen]
  );

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('relative cursor-pointer', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        ...style,
        position: 'relative',
        zIndex: isOpen ? 100 : 1
      }}
      role='button'
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogContent = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContent) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('w-full max-w-[500px] bg-white dark:bg-zinc-900 shadow-lg rounded-2xl overflow-hidden', className)}
      style={{
        ...style,
        position: 'relative',
        zIndex: 100
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen } = useMorphingDialog();
  const [mounted, setMounted] = useState(false);
  const scrollPosition = useRef(0);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position before any modifications
      scrollPosition.current = window.scrollY;
      
      // Add padding to prevent layout shift before modifying overflow
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Lock the body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPosition.current}px`;
    } else {
      // Restore scroll position and cleanup
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      
      // Use requestAnimationFrame to ensure smooth scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition.current);
      });
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, scrollPosition.current);
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode='wait'>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] dark:bg-black/80"
          />
          <div 
            ref={scrollableRef}
            className="fixed inset-0 overflow-y-auto"
            style={{
              height: '100vh',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="min-h-full flex items-center justify-center p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogTitle({
  children,
  className,
  style,
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogSubtitle({
  children,
  className,
  style,
}: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial='initial'
      animate='animate'
      exit='exit'
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  );
}

type MorphingDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function MorphingDialogClose({
  children,
  className,
  variants,
}: MorphingDialogCloseProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type='button'
      aria-label='Close dialog'
      key={`dialog-close-${uniqueId}`}
      className={cn('absolute right-6 top-6', className)}
      initial='initial'
      animate='animate'
      exit='exit'
      variants={variants}
    >
      {children || <XIcon size={24} />}
    </motion.button>
  );
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
}; 