import { getTransforms } from '~/lib/helpers';
import { cn } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';
import type { PageProps } from '~/types';

export const BackPage = ({
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
        'absolute right-0 top-0 h-full w-full rounded-xl text-white shadow-sm transition-all duration-1000',
        className,
        index % 2 === 1 ? 'odd-transform' : 'even-transform'
      )}
      style={{
        backgroundImage: 'url(/assets/cover-texture.jpg)',
        backgroundOrigin: 'border-box',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onClick}
    />
  );
};
