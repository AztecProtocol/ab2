'use client';

import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone';

import { useControllableState } from '~/lib/hooks';
import { cn, formatBytes } from '~/lib/utils';

import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { ScrollArea } from '~/components/ui/scroll-area';

import { File, UploadIcon, X } from 'lucide-react';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFileCount?: DropzoneProps['maxFiles'];
  multiple?: boolean;
  disabled?: boolean;
}

export const FileUploader = (props: FileUploaderProps) => {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      'image/*': [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${String(maxFileCount)} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount
      ) {
        const target =
          updatedFiles.length > 0
            ? `${String(updatedFiles.length)} files`
            : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },

    [files, maxFileCount, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- safe
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        accept={accept}
        disabled={isDisabled}
        maxFiles={maxFileCount}
        maxSize={maxSize}
        multiple={maxFileCount > 1 || multiple}
        onDrop={onDrop}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'border-muted-foreground/25 hover:bg-muted/25 group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon
                    aria-hidden='true'
                    className='size-7 text-muted-foreground'
                  />
                </div>
                <p className='font-medium text-muted-foreground'>
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon
                    aria-hidden='true'
                    className='size-7 text-muted-foreground'
                  />
                </div>
                <div className='flex flex-col gap-px'>
                  <p className='font-medium text-muted-foreground'>
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className='text-muted-foreground/70 text-sm'>
                    You can upload
                    {maxFileCount > 1
                      ? ` ${maxFileCount === Infinity ? 'multiple' : String(maxFileCount)}
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='flex max-h-48 flex-col gap-4'>
            {files.map((file, index) => (
              <FileCard
                // eslint-disable-next-line react/no-array-index-key -- safe
                key={index}
                file={file}
                progress={progresses?.[file.name]}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
};

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

const FileCard = ({ file, progress, onRemove }: FileCardProps) => {
  return (
    <div className='relative flex items-center gap-2.5'>
      <div className='flex flex-1 gap-2.5'>
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className='flex w-full flex-col gap-2'>
          <div className='flex flex-col gap-px'>
            <p className='text-foreground/80 line-clamp-1 text-sm font-medium'>
              {file.name}
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          className='size-7'
          size='icon'
          type='button'
          variant='outline'
          onClick={onRemove}
        >
          <X aria-hidden='true' className='size-4' />
          <span className='sr-only'>Remove file</span>
        </Button>
      </div>
    </div>
  );
};

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

interface FilePreviewProps {
  file: File & { preview: string };
}

const FilePreview = ({ file }: FilePreviewProps) => {
  if (file.type.startsWith('image/')) {
    return (
      <img
        alt={file.name}
        className='aspect-square shrink-0 rounded-md object-cover'
        height={48}
        loading='lazy'
        src={file.preview}
        width={48}
      />
    );
  }

  return <File aria-hidden='true' className='size-10 text-muted-foreground' />;
};
