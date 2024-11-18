import { Stamp, getTransforms } from '~/lib/helpers';
import { cn } from '~/lib/utils';

import { type Variants, motion } from 'framer-motion';
import AztecLogo from 'public/assets/aztec.svg';
import type { PageProps, Service } from '~/types';

interface PassportPageProps extends PageProps {
  services: [Service | null, Service | null, Service | null, Service | null];
}

export const PassportPage = ({
  children,
  className,
  index,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  services,
}: PassportPageProps) => {
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
      <div className='relative flex h-full gap-4'>
        <div className='z-[2] grid w-full grid-cols-2 place-items-center justify-around'>
          {services.map((s, i) => {
            if (s)
              return (
                <div key={s.address}>
                  <img
                    alt={s.service}
                    className='h-32 w-32'
                    src={Stamp[s.service]}
                  />
                </div>
              );
            return (
              <div
                key={`page-${String(index)}-stamp-${String(i)}`}
                className='invisible'
              >
                a
              </div>
            );
          })}
        </div>
        <img
          alt='Aztec Logo'
          className='absolute right-1/2 top-1/2 h-[16rem] w-[16rem] -translate-y-1/2 translate-x-1/2'
          src={AztecLogo}
        />
        {children}
      </div>
    </motion.div>
  );
};
