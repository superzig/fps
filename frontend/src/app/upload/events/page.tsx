'use client';
import { InputFile } from '~/app/_components/ui/fileInput';
import { useState } from 'react';
import { readEventsTestData } from '~/actions';
import { eventsSchema, type EventsType } from '~/definitions';
import { Button } from '~/app/_components/ui/button';
import EventsTable from '~/app/_components/ui/EventsTable';
import { useRouter } from 'next/navigation';

interface EventsData {
  events: EventsType;
  error: string | null;
}
export default function Page() {
  const [data, setData] = useState<EventsData>({ events: [], error: null });
  const { events, error } = data;
  const router = useRouter();

  const onUpload = async (file: File) => {

    const formData = new FormData();
    formData.append('file', file, file.name);
    const response = await fetch('http://localhost:8000/api/validate/returnCompanies', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const validatedData = eventsSchema.safeParse(await response.json());

      if (!validatedData.success) {
        setData({
          events: [],
          error: 'Das Format der Excel-Datei entspricht nicht den Vorgaben.',
        });
        console.log('not validate data', validatedData.error.flatten());
        return;
      }
      console.log('validated events');
      setData({ events: validatedData.data, error: null });
    } else {
      setData({
        events: [],
        error: 'Die Excel-Datei konnte nicht validiert werden.',
      });
    }
  };

  const handleNavigation = () => {
    if (events.length > 0 && events) {
      router.push('/upload/students');
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <div className='mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
            <p className='text-sm font-semibold text-gray-700'>Import</p>
          </div>
          <h1 className='text-4xl font-bold md:text-6xl lg:text-7xl'>
            <span className='text-blue-500'>Veranstaltungsliste</span> hochladen
          </h1>
          <p className='mt-5 text-zinc-700 sm:text-lg md:max-w-prose'>
            Bitte laden Sie die Datei mit den Informationen zu den
            Veranstaltungen der Unternehmen hoch.
          </p>
        </div>
        <InputFile onUpload={onUpload} errorMessage={error}></InputFile>
      </div>
      <div>
        <div className='mb-12 mt-4 flex justify-end text-center align-bottom'>
          <Button
            variant='default'
            disabled={events.length == 0 || !events}
            onClick={handleNavigation}
          >
            Nächster Schritt
          </Button>
        </div>
        <EventsTable events={events} />
      </div>
    </>
  );
}
