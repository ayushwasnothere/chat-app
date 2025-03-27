interface AuthTemplateType {
  children: React.ReactNode;
}

export const AuthTemplate = ({ children }: AuthTemplateType) => {
  return (
    <div className="w-full bg-white flex justify-center items-center">
      <div className="w-7/12 md:w-5/12 flex flex-col justify-center items-center gap-8">
        {children}
      </div>
    </div>
  );
};
