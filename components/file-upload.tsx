import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { AspectRatio } from "./ui/aspect-ratio";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo" | "media";
  onChange: (url?: string) => void;
  value?: string;
  disabled?: boolean
};

const FileUpload = ({ apiEndpoint, onChange, value, disabled }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-80 h-40">
          <Image
            src={value}
            alt="uploaded image"
            className="object-cover rounded-md"
            fill
          />
        </div>
        <Button
          onClick={() => onChange("")}
          variant="ghost"
          type="button"
          disabled={disabled}
          className="mt-2"
        >
          <X className="h-4 w-4" />
          Remove
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
};

export default FileUpload;
