import Image from 'next/image';
import type { Photo as PhotoData } from '@/lib/invitation';

export default function Photo({ photo, className = '', priority = false }: { photo: PhotoData; className?: string; priority?: boolean }) {
  return <div className={`photo ${className}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover', objectPosition: photo.position }} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} /></div>;
}
