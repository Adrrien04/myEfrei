export type Slide = {
  id: number;
  image_url: string;
  title: string | null;
  text: string | null;
};

export const getSlides = async (): Promise<Slide[]> => {
  try {
    const response = await fetch("/api/slides", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch slides");
    return await response.json();
  } catch (error) {
    console.error("Error fetching slides:", error);
    return [];
  }
};
