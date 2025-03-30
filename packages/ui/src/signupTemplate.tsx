import { AuthHeader } from "./authHeader";
import { AuthTemplate } from "./authTemplate";
import { BottomWarning } from "./bottomWarning";
import { Button } from "./button";
import { ErrorBox } from "./errorBox";
import { InputBoxV2 } from "./inputBoxV2";
import { UrlObject } from "url";

export interface SignupTemplateType {
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeConfirmPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  passwordsmatch: boolean;
  passwordcheck: boolean;
}

export const SignupTemplate = ({
  onChangeName,
  onChangeUsername,
  onChangePassword,
  onChangeConfirmPassword,
  errObject,
  onClickButton,
  linkComponent,
  passwordsmatch,
  passwordcheck,
}: SignupTemplateType) => {
  return (
    <AuthTemplate>
      <AuthHeader
        heading="Create an account"
        subheading="Enter your name, username and password to create an account"
      />
      <div className="flex flex-col justify-center items-center w-full gap-6">
        <InputBoxV2 placeholder="Name" onChange={onChangeName} />
        <InputBoxV2 placeholder="Username" onChange={onChangeUsername} />
        <div className="w-full flex flex-col gap-1">
          <InputBoxV2 placeholder="Password" onChange={onChangePassword} />
          <div
            className={`text-xs hidden text-gray-400 ${passwordcheck ? "text-green-500" : "text-red-400"}`}
          >
            Atleast 6-characters
          </div>
        </div>
        <div className="w-full flex flex-col gap-1">
          <InputBoxV2
            placeholder="Confirm Password"
            onChange={onChangeConfirmPassword}
          />
          <div
            className={`text-xs text-gray-400 ${passwordsmatch ? "hidden" : "text-red-400"}`}
          >
            Passwords must match
          </div>
        </div>
        <ErrorBox errObject={errObject} />
      </div>
      <div className="w-full flex flex-col gap-2 justify-center items-center">
        <Button label="Sign up" onClick={onClickButton} />
        <BottomWarning
          label="Already have an account?"
          link="/signin"
          linkText="Login"
          LinkComponent={linkComponent}
        />
      </div>
    </AuthTemplate>
  );
};
