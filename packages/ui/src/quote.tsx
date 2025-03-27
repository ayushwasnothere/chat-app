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
          {quote ||
            "Blogging is not a business by itself. It is only a means of making you visible and getting recognized."}
        </div>
        <div>
          <div className="font-bold text-xl">{author || "David Risley"}</div>
          <div className="text-slate-400 text-md">
            {authorDescription ||
              "Professional Blogger and Online Entrepreneur"}
          </div>
        </div>
      </div>
    </div>
  );
};
