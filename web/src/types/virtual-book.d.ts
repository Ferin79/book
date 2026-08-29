declare module 'virtual:book' {
  export interface Chapter {
    id: string;
    number: string;
    label: string;
    title: string;
    html: string;
    wordCount: number;
    readingMinutes: number;
  }

  export const chapters: Chapter[];
}
