/* eslint-disable react/no-array-index-key -- safe */
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { useBiometric, usePassport } from '~/lib/hooks';
import { truncate } from '~/lib/utils';

import { sleep } from '@aztec/aztec.js';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { FileUploader } from '~/components/ui/file-upload';
import { Ripple } from '~/components/ui/ripple';
import { StepButton } from '~/components/ui/step-button';
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
  Loader2Icon,
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
  const [idDescriptors, setIdDescriptors] = useState<number[] | null>(null);
  const [faceDescriptors, setFaceDescriptors] = useState<number[] | null>(null);

  return (
    <div className='p-4'>
      <Stepper initialStep={0} size='lg' steps={items}>
        {items.map((step, index) => (
          <Step key={index} {...step}>
            <div className='py-4'>
              {step.id === 'document-upload' && (
                <DocumentUpload
                  descriptors={idDescriptors}
                  setDescriptors={setIdDescriptors}
                />
              )}
              {step.id === 'face-scan' && (
                <FaceScan
                  descriptors={faceDescriptors}
                  setDescriptors={setFaceDescriptors}
                />
              )}
              {step.id === 'verify-data' && (
                <FaceVerify
                  faceDescriptors={faceDescriptors}
                  idDescriptors={idDescriptors}
                />
              )}
            </div>
          </Step>
        ))}
        <Actions
          faceDescriptors={faceDescriptors}
          idDescriptors={idDescriptors}
        />
      </Stepper>
    </div>
  );
};

interface ActionProps {
  idDescriptors: number[] | null;
  faceDescriptors: number[] | null;
}

const Actions = ({ idDescriptors, faceDescriptors }: ActionProps) => {
  const { nextStep, prevStep, isLastStep, currentStep } = useStepper();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const { verifyBiometric } = usePassport();

  const onVerify = async () => {
    try {
      setStatus('loading');
      if (!idDescriptors || !faceDescriptors) {
        throw new Error('Missing descriptors');
      }
      const tx = await verifyBiometric(idDescriptors, faceDescriptors);
      toast.success('GitHub verification successful', {
        description: `Transaction ID: ${truncate(tx.txHash.to0xString())}`,
      });
      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error) {
      setStatus('error');
      console.error(error);
      await sleep(3000);
    } finally {
      setStatus('idle');
    }
  };

  const canGoToNextStep = () => {
    if (currentStep?.id === 'document-upload') {
      return idDescriptors !== null;
    }

    if (currentStep?.id === 'face-scan') {
      return faceDescriptors !== null;
    }

    return true;
  };

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
          disabled={!canGoToNextStep()}
          onClick={nextStep}
        >
          Next <ArrowRight />
        </Button>
      )}
      {isLastStep ? (
        <StepButton
          className='h-9 w-full font-semibold'
          currentMode={status}
          variant='default'
          errorContent={
            <div className='flex flex-row items-center justify-center gap-2'>
              <div>❌</div> Error
            </div>
          }
          finalContent={
            <div className='flex flex-row items-center justify-center gap-2'>
              <div>✅</div> Verified
            </div>
          }
          initialContent={
            <div className='flex flex-row items-center justify-center gap-2'>
              Verify
            </div>
          }
          loadingContent={
            <div className='flex flex-row items-center justify-center gap-1'>
              <Loader2Icon className='animate-spin' size={18} />
              Verifying...
            </div>
          }
          variants={{
            initial: { y: '-120%' },
            animate: { y: '0%' },
            exit: { y: '120%' },
          }}
          onClick={onVerify}
        />
      ) : null}
    </div>
  );
};

interface FileUploadPropsBase {
  descriptors: number[] | null;
  setDescriptors: (descriptors: number[] | null) => void;
}

const DocumentUpload = ({ setDescriptors }: FileUploadPropsBase) => {
  const [file, setFile] = useState<File | null>(null);
  const { getDescriptors } = useBiometric();
  return (
    <div className=''>
      <FileUploader
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
        value={file ? [file] : undefined}
        onValueChange={(files) => {
          if (!files[0]) {
            toast.error('Invalid file type');
            return;
          }
          const face = files[0];
          setFile(face);
          // convert to base64 url
          const reader = new FileReader();
          reader.onload = async () => {
            const descriptors = await getDescriptors(reader.result as string);
            console.log(descriptors);
            setDescriptors(descriptors);
          };
          reader.readAsDataURL(face);
        }}
      />
    </div>
  );
};

const FaceScan = ({ setDescriptors }: FileUploadPropsBase) => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const webcamRef = useRef<Webcam | null>(null);
  const { getDescriptors } = useBiometric();
  const onVerify = async () => {
    try {
      setStatus('loading');
      if (!webcamRef.current) {
        throw new Error('Webcam not found');
      }

      const dataUrl = webcamRef.current.getScreenshot();
      if (!dataUrl) {
        throw new Error('Error capturing photo');
      }
      const descriptors = await getDescriptors(dataUrl);
      setDescriptors(descriptors);

      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error) {
      setStatus('error');
      console.error(error);
      await sleep(3000);
    } finally {
      setStatus('idle');
    }
  };
  return (
    <div className='flex flex-col'>
      <div className='relative mx-auto flex aspect-square w-[20rem] items-center justify-center'>
        <Webcam
          ref={webcamRef}
          className='z-[2] aspect-square w-[10rem] rounded-full'
          screenshotFormat='image/jpeg'
          videoConstraints={{ aspectRatio: 1 }}
        />
        <Ripple mainCircleSize={100} />
      </div>
      <StepButton
        className='mx-auto h-9 w-fit -translate-y-12 font-semibold'
        currentMode={status}
        variant='default'
        errorContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            <div>❌</div> Error
          </div>
        }
        finalContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            <div>✅</div> Captured
          </div>
        }
        initialContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            Capture
          </div>
        }
        loadingContent={
          <div className='flex flex-row items-center justify-center gap-1'>
            <Loader2Icon className='animate-spin' size={18} />
            Capturing...
          </div>
        }
        variants={{
          initial: { y: '-120%' },
          animate: { y: '0%' },
          exit: { y: '120%' },
        }}
        onClick={onVerify}
      />
    </div>
  );
};

const FaceVerify = ({ idDescriptors, faceDescriptors }: ActionProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-xl font-medium'>Computed Descriptors</div>
      <pre className='hide-scrollbar max-h-64 overflow-hidden overflow-y-scroll text-wrap break-all rounded-2xl bg-neutral-100 p-3'>
        {JSON.stringify(
          {
            actual: idDescriptors?.join(','),
            expected: faceDescriptors?.join(','),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};
