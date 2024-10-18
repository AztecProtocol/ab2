'use client';

import React, { useState } from 'react';

import { BackPage } from './back-page';
import { CoverPage } from './cover-page';
import { PassportPage } from './passport-page';

type PageType = 'cover' | 'back' | 'page';

export const Passport = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const goToNextPage = () => {
    const nextPage =
      currentPage + 2 >= pages.length ? pages.length : currentPage + 2;
    setCurrentPage(nextPage);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 2, 1));
  };

  const pages: PageType[] = [
    'cover',
    ...Array.from({ length: 4 }, (_) => `page` as PageType),
    'back',
  ];

  const getXTranslate = () => {
    if (currentPage > 1) {
      return '50%';
    }
    return '0%';
  };

  return (
    <div
      className='h-[28.4rem] w-[20rem] transition-all duration-1000'
      style={{
        transform: `rotateX(10deg) rotateY(-5deg) translateX(${getXTranslate()})`,
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
            totalPages={pages.length}
          >
            {page}
          </PassportPage>
        );
      })}
    </div>
  );
};
