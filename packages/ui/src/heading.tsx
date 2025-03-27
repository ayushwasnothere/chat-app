export const Heading = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex font-bold text-4xl md:text-5xl lg:text-6xl">
      {children}
    </div>
  );
};
