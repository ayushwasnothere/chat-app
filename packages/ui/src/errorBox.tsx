interface ErrorBoxType {
  errObject: {
    err: boolean;
    message: string;
  };
}

export const ErrorBox = ({ errObject }: ErrorBoxType) => {
  return (
    <div
      className={`${errObject.err ? "" : "hidden"} w-full bg-red-50 px-5 md:px-10 lg:px-16 py-4 border-red-200 border-0 rounded text-xs text-red-400 text-center`}
    >
      {errObject.message}
    </div>
  );
};
