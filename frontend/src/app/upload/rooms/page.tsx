'use client';
import MaxWidthWrapper from '~/app/_components/ui/MaxWidthWrapper';
import { InputFile } from '~/app/_components/ui/fileInput';
import { useState } from 'react';
import { readRoomsTestData } from '~/actions';
import { roomsSchema, type RoomsType } from '~/definitions';
import { Button } from '~/app/_components/ui/button';
import RoomsTable from '~/app/_components/ui/RoomsTable';

interface roomsData {
  rooms: RoomsType;
  error: string | null;
}

export default function Page() {
  const [data, setData] = useState<roomsData>({ rooms: [], error: null });
  const { rooms, error } = data;

  const onUpload = async () => {
    const data = await readRoomsTestData(); // TODO: replace with API CALL which returns JSON
    console.log(data);
    const validatedData = roomsSchema.safeParse(data);

    if (!validatedData.success) {
      setData({
        rooms: [],
        error: 'Das Format der Excel-Datei entspricht nicht den Vorgaben.',
      });
      console.log('not validate data', validatedData.error.flatten());
      return;
    }
    console.log('validated events');
    setData({ rooms: validatedData.data, error: null });
  };

  return (
    <>
      <MaxWidthWrapper className='mb-5 mt-10 flex flex-col'>
        <div className='mb-4'>
          <div className='mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
            <p className='text-sm font-semibold text-gray-700'>Import</p>
          </div>
          <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl'>
            <span className='text-blue-500'>Raumliste</span> hochladen
          </h1>
          <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'>
            Bitte laden Sie die Datei mit den Informationen zu den Räumen hoch.
            Kapazitäten der Räume können im Voraus festgelegt werden.
          </p>
        </div>
        <InputFile onUpload={onUpload} errorMessage={error}></InputFile>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <div className='mb-12 flex justify-end text-center align-bottom'>
          <Button variant='default' disabled={rooms.length == 0 || !rooms}>
            Nächster Schritt
          </Button>
        </div>
        <RoomsTable rooms={rooms} />
      </MaxWidthWrapper>
    </>
  );
}
