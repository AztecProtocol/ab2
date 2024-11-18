'use client';

import React, { useMemo, useState } from 'react';

import { usePassport } from '~/lib/hooks';

import { type Service } from '~/types';

import { BackPage } from './back-page';
import { CoverPage } from './cover-page';
import { PassportPage } from './passport-page';

type PageType = 'cover' | 'back' | 'page';

export const Passport = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { verifiedServices } = usePassport();

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 2);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 2);
  };

  const getXTransom = () => {
    if (currentPage > pages.length) {
      return '100%';
    } else if (currentPage > 1) {
      return '50%';
    }
    return '0%';
  };

  const pages: PageType[] = [
    'cover',
    ...Array.from({ length: 4 }, (_) => `page` as PageType), // no fix for odd pages
    'back',
  ];

  const services = useMemo(() => {
    const services: [
      Service | null,
      Service | null,
      Service | null,
      Service | null,
    ][] = [];

    // divide verified services into groups of 4
    for (let i = 0; i < verifiedServices.length; i += 4) {
      services.push([
        verifiedServices[i] ?? null,
        verifiedServices[i + 1] ?? null,
        verifiedServices[i + 2] ?? null,
        verifiedServices[i + 3] ?? null,
      ]);
    }

    return services;
  }, [verifiedServices]);

  return (
    <div
      className='h-[14.2rem] w-[10rem] transition-all duration-1000 md:h-[28.4rem] md:w-[20rem]'
      style={{
        transform: `rotateX(10deg) rotateY(-8deg) translateX(${getXTransom()})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {pages.map((page, index) => {
        if (page === 'cover') {
          return (
            <CoverPage
              key={page}
              currentPage={currentPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              index={index + 1}
              totalPages={pages.length}
            >
              {page}
            </CoverPage>
          );
        } else if (page === 'back') {
          return (
            <BackPage
              key={page}
              currentPage={currentPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              index={index + 1}
              totalPages={pages.length}
            >
              {page}
            </BackPage>
          );
        }
        return (
          <PassportPage
            key={page}
            currentPage={currentPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            index={index + 1}
            services={services[index - 1] ?? [null, null, null, null]}
            totalPages={pages.length}
          />
        );
      })}
    </div>
  );
};
