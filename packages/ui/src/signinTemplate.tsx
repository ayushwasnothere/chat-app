import { UrlObject } from "url";
import { AuthHeader } from "./authHeader";
import { AuthTemplate } from "./authTemplate";
import { BottomWarning } from "./bottomWarning";
import { Button } from "./button";
import { ErrorBox } from "./errorBox";
import { InputBoxV2 } from "./inputBoxV2";

export interface SigninTemplateType {
  onChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errObject: {
    err: boolean;
    message: string;
  };
  onClickButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  linkComponent: React.ComponentType<{
    href: string | UrlObject;
    children: React.ReactNode;
    className?: string;
  }>;
}

export const SigninTemplate = ({
  onChangeUsername,
  onChangePassword,
  errObject,
  onClickButton,
  linkComponent,
}: SigninTemplateType) => {
  return (
    <AuthTemplate>
      <AuthHeader
        heading="Welcome"
        subheading="Enter your username and password to access your account"
      />
      <div className="flex flex-col justify-center items-center w-full gap-6">
        <InputBoxV2 placeholder="Username" onChange={onChangeUsername} />
        <InputBoxV2 placeholder="Password" onChange={onChangePassword} />
        <ErrorBox errObject={errObject} />
      </div>
      <div className="w-full flex flex-col gap-2 justify-center items-center">
        <Button label="Sign up" onClick={onClickButton} />
        <BottomWarning
          label="Dont have an account? "
          link="/signup"
          linkText="Register"
          LinkComponent={linkComponent}
        />
      </div>
    </AuthTemplate>
  );
};
