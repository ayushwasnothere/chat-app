import { Quote, QuoteProps } from "./quote";
import { SigninTemplate, SigninTemplateType } from "./signinTemplate";

export interface SigninPageProps {
  signinQuoteProps: QuoteProps;
  signinTemplateProps: SigninTemplateType;
}

export const SigninPage = ({
  signinQuoteProps,
  signinTemplateProps,
}: SigninPageProps) => {
  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
      <Quote {...signinQuoteProps} />
      <SigninTemplate {...signinTemplateProps} />
    </div>
  );
};
