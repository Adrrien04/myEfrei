export interface Event {
    time: any;
    id: number;
    title: string;
    date: string;
    description: string;
    location: string;
}

export const getEvents = async (): Promise<Event[]> => {
    const response = await fetch('/api/events', { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
    }

    const data = await response.json();
    return data;
};
