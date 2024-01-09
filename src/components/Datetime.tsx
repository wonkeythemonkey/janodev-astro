import { LOCALE } from "@config";

export interface DateFormatOptions {
  date?: Intl.DateTimeFormatOptions | false;
  time?: Intl.DateTimeFormatOptions | false;
}

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
  dateFormat?: DateFormatOptions;
}

interface Props extends DatetimesProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  dateFormat,
  size = "sm",
  className,
}: Props) {
  return (
    <div className={`flex items-center space-x-2 opacity-80 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>
      {modDatetime ? (
        <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
          Updated:
        </span>
      ) : (
        <span className="sr-only">Published:</span>
      )}
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
          dateFormat={dateFormat}
        />
      </span>
    </div>
  );
}

const FormattedDatetime = ({
  pubDatetime,
  modDatetime,
  dateFormat,
}: DatetimesProps & {
  dateFormat?: {
    date?: Intl.DateTimeFormatOptions | false;
    time?: Intl.DateTimeFormatOptions | false;
  };
}) => {
  dateFormat = dateFormat ? dateFormat : {};
  const myDatetime = new Date(modDatetime ? modDatetime : pubDatetime);

  const defaultDateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const defaultTimeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    ...defaultDateOptions,
    ...dateFormat.date,
  });

  const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
    ...defaultTimeOptions,
    ...dateFormat.time,
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
      {dateFormat.time === false ? "" : <span aria-hidden="true"> | </span>}
      {dateFormat.time === false ? (
        ""
      ) : (
        <span className="sr-only">&nbsp;at&nbsp;</span>
      )}
      {dateFormat.time === false ? (
        ""
      ) : (
        <span className="text-nowrap">{time}</span>
      )}
    </>
  );
};
