'use client';
import { InputFile } from '~/app/_components/ui/fileInput';
import { useState } from 'react';
import {
    type DataResponse,
    eventSchema,
    type EventType,
    excelEventKeyMap,
} from '~/definitions';
import { Button } from '~/app/_components/ui/button';
import EventsTable from '~/app/_components/ui/EventsTable';
import { useRouter } from 'next/navigation';
import { readExcelFile } from '~/lib/utils';
import useDataStore from '~/app/hooks/useDataStore';

export default function Page() {
    const [cachedEvents, addJson] = useDataStore((state) => [
        state.objects.events,
        state.addJson,
    ]);
    const [data, setData] = useState<DataResponse<EventType>>({
        data: cachedEvents ?? [],
        error: null,
    });
    const { data: events, error } = data;
    const router = useRouter();

    const onUpload = async (file: File) => {
        const data = await readExcelFile(file, eventSchema, excelEventKeyMap);
        setData(data);

        if (!data.error) {
            addJson('events', data.data);
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
                        <p className='text-sm font-semibold text-gray-700'>
                            Import
                        </p>
                    </div>
                    <h1 className='text-4xl font-bold md:text-6xl lg:text-7xl'>
                        <span className='text-primary'>
                            Veranstaltungsliste
                        </span>{' '}
                        hochladen
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
