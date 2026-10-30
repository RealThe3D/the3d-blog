export declare const scaffoldPost: (
  title: string,
  postsDir?: string,
  date?: Date,
) => Promise<string>;

export declare const slugifyTitle: (title: string) => string;
