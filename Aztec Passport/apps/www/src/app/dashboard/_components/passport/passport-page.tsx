import Image from 'next/image';

import { getTransforms } from '~/lib/helpers';
import { cn } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';
import AztecLogo from 'public/aztec.svg';
import type { PageProps } from '~/types';

export const PassportPage = ({
  children,
  className,
  index,
  currentPage,
  goToNextPage,
  goToPreviousPage,
}: PageProps) => {
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

  const properties = getTransforms(isLeftSide, index);

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
        'absolute right-0 top-0 h-full w-full rounded-xl bg-blue-50 shadow-sm transition-all duration-1000',
        className,
        index % 2 === 1 ? 'odd-transform' : 'even-transform'
      )}
      onClick={onClick}
    >
      <div className='relative flex h-full items-center justify-center gap-4'>
        <Image
          alt='Aztec Logo'
          className='absolute right-1/2 top-1/2 h-[16rem] w-[16rem] -translate-y-1/2 translate-x-1/2'
          src={AztecLogo as unknown as string}
        />
        {children}
      </div>
    </motion.div>
  );
};
