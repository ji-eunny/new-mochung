import Image from 'next/image';
import { assetPath } from '@/lib/asset';
import { cn } from '@/lib/utils';
import type { Photo as PhotoData } from '@/lib/invitation';

type PhotoProps = {
  photo: PhotoData;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** 지정한 영역(className으로 크기·비율 지정)을 꽉 채우는 이미지. */
export default function Photo({ photo, className, sizes = '(max-width: 480px) 100vw, 480px', priority = false }: PhotoProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={assetPath(photo.src)}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: photo.position }}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
