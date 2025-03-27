import { Heading } from "./heading";
import { SubHeading } from "./subHeading";

interface AuthHeaderType {
  heading: string;
  subheading: string;
}
export const AuthHeader = ({ heading, subheading }: AuthHeaderType) => {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <Heading>{heading}</Heading>
      <SubHeading>{subheading}</SubHeading>
    </div>
  );
};
