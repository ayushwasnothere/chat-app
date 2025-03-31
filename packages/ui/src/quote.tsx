export interface QuoteProps {
  quote: string;
  author: string;
  authorDescription: string;
}

export const Quote = ({ quote, author, authorDescription }: QuoteProps) => {
  return (
    <div className="hidden w-full bg-gray-100 pl-20 pr-10 xl:pl-40 xl:pr-20 lg:flex justify-center">
      <div className="flex flex-col justify-center gap-4">
        <div className="font-bold text-3xl">
          "
          {quote ||
            "Like a raven’s call in the silent night, a message carries both mystery and meaning."}
          "
        </div>
        <div>
          <div className="font-bold text-xl">{author || "The Raven"}</div>
          <div className="text-slate-400 text-md">
            {authorDescription || "Unknown"}
          </div>
        </div>
      </div>
    </div>
  );
};
