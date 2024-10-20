/* eslint-disable react/no-array-index-key -- safe */
import React, { useState } from 'react';

import { Button } from '~/components/ui/button';
import { FileUploader } from '~/components/ui/file-upload';
import { Ripple } from '~/components/ui/ripple';
import {
  Step,
  type StepItem,
  Stepper,
  useStepper,
} from '~/components/ui/stepper';

import {
  ArrowLeft,
  ArrowRight,
  BookCheckIcon,
  ScanFaceIcon,
  ShieldCheckIcon,
} from 'lucide-react';

const items: StepItem[] = [
  {
    id: 'document-upload',
    optional: false,
    icon: BookCheckIcon,
  },
  {
    id: 'face-scan',
    icon: ScanFaceIcon,
    optional: false,
  },
  {
    id: 'verify-data',
    icon: ShieldCheckIcon,
    optional: false,
  },
];

export const FaceStepper = () => {
  return (
    <div className='p-4'>
      <Stepper initialStep={0} size='lg' steps={items}>
        {items.map((step, index) => (
          <Step key={index} {...step}>
            <div className='py-4'>
              {step.id === 'document-upload' && <DocumentUpload />}
              {step.id === 'face-scan' && <FaceScan />}
              {step.id === 'verify-data' && <FaceVerify />}
            </div>
          </Step>
        ))}
        <Actions />
      </Stepper>
    </div>
  );
};

const Actions = () => {
  const { nextStep, prevStep, isLastStep, currentStep } = useStepper();

  return (
    <div className='flex w-full flex-row gap-4'>
      {currentStep?.id !== 'document-upload' && (
        <Button
          className='flex w-full flex-row items-center justify-center gap-2'
          variant='secondary'
          onClick={prevStep}
        >
          <ArrowLeft /> Back
        </Button>
      )}
      {!isLastStep && (
        <Button
          className='flex w-full flex-row items-center justify-center gap-2'
          onClick={nextStep}
        >
          Next <ArrowRight />
        </Button>
      )}
      {isLastStep ? (
        <Button className='flex w-full flex-row items-center justify-center gap-2'>
          Verify
        </Button>
      ) : null}
    </div>
  );
};

const DocumentUpload = () => {
  const [file, setFile] = useState<File>();
  return (
    <div className=''>
      <FileUploader
        value={file ? [file] : undefined}
        onValueChange={(files) => {
          setFile(files[0]);
        }}
      />
    </div>
  );
};

const FaceScan = () => {
  return (
    <div className='relative mx-auto aspect-square w-[20rem]'>
      <Ripple mainCircleSize={100} />
    </div>
  );
};

const FaceVerify = () => {
  const descriptors = Array.from({ length: 128 }, () => Math.random());
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xl font-medium'>Computed Descriptors</div>
      <pre className='hide-scrollbar max-h-64 overflow-hidden overflow-y-scroll text-wrap break-all rounded-2xl bg-neutral-100 p-3'>
        {JSON.stringify(descriptors, null, 2)}
      </pre>
    </div>
  );
};
