import { CircleAlertIcon } from "lucide-react";

export default function ErrorState({
  description,
  title,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='py-4 px-8 flex flex-1 items-center justify-center'>
      <div
        role='alert'
        className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm'
      >
        <CircleAlertIcon aria-hidden='true' className='size-6 text-destructive' />
        <div className='flex flex-col gap-y-2 text-center'>
          <h6 className='text-lg font-medium'>{title}</h6>
          <p className='text-sm'>{description}</p>
        </div>
      </div>
    </div>
  );
}
