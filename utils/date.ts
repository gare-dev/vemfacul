import { AxiosRequestTransformer } from "axios";
import { formatISO, isValid, parseJSON } from "date-fns";

export const applyRecursive = (
  obj: { [key: string]: any },
  mapFunction: (value: (typeof obj)[keyof typeof obj]) => any
) => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      obj[key] = applyRecursive(value, mapFunction);
    } else {
      obj[key] = mapFunction(value);
    }
  }
  return obj;
};

export const isIsoDateString = (value: any): boolean => {
  return value && typeof value === "string" && isValid(parseJSON(value));
};

export const handleDates = (body: {
  [key: string]: any;
}): { [key: string]: any } => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body;
  }

  const newBody = applyRecursive(body, (item) => {
    return isIsoDateString(item) ? parseJSON(item) : item;
  });

  return newBody;
};

export const dateTransformer: AxiosRequestTransformer = function (
  data,
  headers
) {
  if (data instanceof Date) {
    const date = formatISO(data, { format: "extended" });
    return date;
  }
  if (Array.isArray(data)) {
    return data.map((val) => dateTransformer.call(this, val, headers));
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        dateTransformer.call(this, val, headers),
      ])
    );
  }
  return data;
};
