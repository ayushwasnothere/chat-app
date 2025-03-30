import { format, isToday, isYesterday, differenceInDays } from "date-fns";

export function formatTo24Hour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (differenceInDays(new Date(), date) < 7) {
    return format(date, "EEEE");
  }
  return format(date, "dd MMMM");
};

export const groupMessagesByDate = (messages: any[]) => {
  return messages.reduce(
    (acc, msg) => {
      const dateLabel = formatChatDate(msg.createdAt);
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    },
    {} as Record<string, any[]>,
  );
};
