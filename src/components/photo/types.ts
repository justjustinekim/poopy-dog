
export interface PhotoUploadProps {
  onPhotoCapture: (file: File) => void;
  className?: string;
  initialPhotoUrl?: string | null;
  snapchatStyle?: boolean;
}
