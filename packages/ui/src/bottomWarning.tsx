import { UrlObject } from "url";

interface BottomWarningType {
  label: string;
  link: string;
  linkText: string;
  LinkComponent: React.ComponentType<{
    href: string | UrlObject;
    className?: string;
    children: React.ReactNode;
  }>;
}

export const BottomWarning = ({
  label,
  link,
  linkText,
  LinkComponent,
}: BottomWarningType) => {
  return (
    <div className="flex text-gray-400 text-xs md:text-sm">
      {label}
      <LinkComponent href={link} className="underline">
        {linkText}
      </LinkComponent>
    </div>
  );
};
