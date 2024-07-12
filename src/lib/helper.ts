import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function dateConverterCreatedAt(date: Date) {
  const d = date;
  if (dayjs(d).isToday()) {
    return `${dayjs(d).format("HH:mm")}`;
  }
  return dayjs(d).format("DD MMM");
}
