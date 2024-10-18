'use client';

import { type ComponentProps, useState } from 'react';

import { cn } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';

interface PageProps extends ComponentProps<'div'> {
  index: number;
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const getTransform = (isLeftSide: boolean, index: number) => {
  if (isLeftSide) {
    if (index % 2 === 1) {
      return {
        translateZ: `${String(3 * index)}px`,
        rotateY: '-180deg',
        scaleX: 1,
        translateX: '0%',
      };
    }
    return {
      translateZ: `${String(3 * index)}px`,
      rotateY: '180deg',
      scaleX: -1,
      translateX: '-100%',
    };
  }

  if (index % 2 === 1) {
    return {
      translateZ: `${String(-3 * index)}px`,
      rotateY: '0deg',
      scaleX: 1,
      translateX: '0%',
    };
  }
  return {
    translateZ: `${String(-3 * index)}px`,
    rotateY: '0deg',
    scaleX: -1,
    translateX: '-100%',
  };
};

const Page = ({
  children,
  className,
  index,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
}: PageProps) => {
  const colors = ['#fee2e2', '#dcfce7', '#dbeafe', '#ffedd5'];
  const isLeftSide = currentPage > index;

  const onClick = () => {
    if (index === currentPage) {
      goToNextPage();
      return;
    }
    if (index === currentPage - 1) {
      goToPreviousPage();
    }
  };

  const properties = getTransform(isLeftSide, index);

  const variants: Variants = {
    initial: {
      translateZ: properties.translateZ,
      rotateY: properties.rotateY,
      scaleX: properties.scaleX,
      translateX: properties.translateX,
    },
    animate: {
      translateZ: properties.translateZ,
      rotateY: properties.rotateY,
      scaleX: properties.scaleX,
      translateX: properties.translateX,
    },
  };

  return (
    <motion.div
      animate='animate'
      initial='initial'
      variants={variants}
      className={cn(
        'absolute right-0 top-0 h-[30rem] w-[20rem] transition-all duration-1000',
        className,
        index % 2 === 1 ? 'odd-transform' : 'even-transform'
      )}
      style={{
        backgroundColor: colors[index % colors.length] ?? '',
      }}
      onClick={onClick}
    >
      {children}
      <div>Index: {index}</div>
      <div>Current: {currentPage}</div>
    </motion.div>
  );
};

export const Book = () => {
  const pages = [
    'Cover',
    ...Array.from({ length: 11 }, (_, i) => `Page ${String(i + 1)}`),
    'The End',
  ];

  const [currentPage, setCurrentPage] = useState<number>(1);

  const goToNextPage = () => {
    const nextPage =
      currentPage + 2 >= pages.length ? pages.length : currentPage + 2;
    setCurrentPage(nextPage);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 2, 1));
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <div
        className='absolute h-[28.4rem] w-[20rem]  transition-all duration-1000'
        style={{
          transform: `rotateX(10deg) rotateY(-10deg) translateX(${currentPage > 1 ? '50%' : '0%'})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {pages.map((page, index) => {
          return (
            <Page
              key={page}
              currentPage={currentPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              index={index + 1}
              totalPages={pages.length}
            >
              {page}
            </Page>
          );
        })}
      </div>
    </div>
  );
};
