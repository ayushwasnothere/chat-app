import { Quote, QuoteProps } from "./quote";
import { SignupTemplate, SignupTemplateType } from "./signupTemplate";

export interface SignupPageProps {
  signupQuoteProps: QuoteProps;
  signupTemplateProps: SignupTemplateType;
}

export const SignupPage = ({
  signupQuoteProps,
  signupTemplateProps,
}: SignupPageProps) => {
  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
      <Quote {...signupQuoteProps} />
      <SignupTemplate {...signupTemplateProps} />
    </div>
  );
};
