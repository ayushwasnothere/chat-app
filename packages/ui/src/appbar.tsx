import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  // TODO: add the types
  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between border-b px-4">
      <div className="text-lg flex flex-col justify-center">ChatApp</div>
      <div className="flex flex-col justify-center pt-2">
        <Button
          onClick={user ? onSignout : onSignin}
          label={user ? "Logout" : "Login"}
        />
      </div>
    </div>
  );
};
