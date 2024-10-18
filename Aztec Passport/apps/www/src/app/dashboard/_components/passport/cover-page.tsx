import Image from 'next/image';

import { getTransforms } from '~/lib/helpers';
import { cn } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';
import GlobeSVG from 'public/assets/globe.png';
import type { PageProps } from '~/types';

export const CoverPage = ({
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
    >
      <div className='my-6 flex flex-col items-center justify-center gap-4 md:my-12'>
        <Image
          alt='Globe'
          className='h-[6rem] w-[6rem] invert-[0.9] md:h-[13rem] md:w-[13rem]'
          height={200}
          src={GlobeSVG as unknown as string}
          width={200}
        />
        <div className='text-center text-xl font-medium text-[#cdcdcd] md:text-3xl'>
          Aztec <br />
          Passport
        </div>
      </div>
    </motion.div>
  );
};
