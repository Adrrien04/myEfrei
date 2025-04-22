export interface Article {
    id: number;
    title: string;
    content: string;
    image_url: string;
}

export const getNews = async (): Promise<Article[]> => {
    const response = await fetch('/api/articles', { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
    }

    const data = await response.json();
    return data;
};
