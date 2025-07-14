/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
import { toast } from "react-toastify";
import SharedConfig from "./SharedConfig";
import fetcher from "../utils/SharedFetcher";
import Fetcher from "../utils/Fetcher";
import { IAny } from "reblendjs";

export const isActivePath = (
  routeName: string,
  location: URL | null | undefined
) => {
  if (location) {
    const path = location.pathname;
    const splitted = path.split("/");
    for (let i = 0; i < splitted.length; i++) {
      const segment = splitted[i];
      const routing = routeName.split("/")[1];
      if (segment === routing) {
        return "active";
      }
    }
  }
  return "";
};

export async function getSupportedToken(type: any) {
  const data = await fetcher.fetch(`/${type}/supported-tokens`);
  if (data) {
    if (data.connection.statusCode !== 200) {
      toast.error(data?.connection?.message);
      return [];
    }
    return data.data.tokens;
  } else {
    toast.error("Error fectching token. ");
  }
  return {};
}

export function redirect(url: any) {
  if (url instanceof Function) {
    SharedConfig.addTo("redirectListeners", url);
  } else {
    const redirectListeners = SharedConfig.get("redirectListeners");
    if (redirectListeners instanceof Array) {
      redirectListeners.forEach((fn) => fn(url));
    } else {
      redirectListeners(url);
    }
  }
}

export function objectEquals(
  obj1: { [x: string]: any } | null,
  obj2: { [x: string]: any } | null
) {
  // Check if both object are strictly equal
  if (obj1 === obj2) {
    return true;
  }

  // Check if either object is null or not
  if (
    typeof obj1 !== "object" ||
    obj1 == null ||
    typeof obj2 !== "object" ||
    obj2 == null
  ) {
    return false;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Iterate through the keys and recursively check for equality
  for (const key of keys1) {
    if (!keys2.includes(key) || !objectEquals(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export function encodeQuery(object = {}) {
  return btoa(JSON.stringify(object));
}

export async function getDataUrl(data: Blob) {
  return await new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => {
        const uri = reader.result;
        resolve(uri);
      };
    } catch (error) {
      reject(error);
    }
  });
}

export async function getDataUrlFromUrl(url: string) {
  return await new Promise((resolve, reject) => {
    async function runner() {
      try {
        const imo = {
          url,
          method: "GET",
        };
        const idata = await fetcher.fetch(imo, Fetcher.RETURN_BLOB);
        const uri = await getDataUrl(idata);
        resolve(uri);
      } catch (error) {
        reject(error);
      }
    }
    runner();
  });
}

export const paginatingUrl = (url: any, data: {} | undefined, size = 10) => {
  const dataString = encodeQuery(data);
  return `${url}?q=${dataString}&size=${size}`;
};

export function camelCaseToTitleCase(camelCaseString: string) {
  // Insert a space before each uppercase letter and capitalize the first letter of the resulting string
  const result = camelCaseString
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Handle camelCase transitions
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Handle sequences of uppercase letters followed by a lowercase letter
    .replace(/^./, function (str: string) {
      return str.toUpperCase();
    }); // Capitalize the first character

  return result;
}

export const mongooseModelQueryObjectForDateRange = (
  path = "createdAt.date",
  dateRange: string | undefined
) => {
  let high = new Date();
  let low = new Date();

  switch (dateRange) {
    case "lastweek":
      {
        const d = new Date();
        const todayWeekDay = d.getDay();
        const todayDate = d.getDate();
        const weekEnd = new Date();
        weekEnd.setDate(todayDate - (todayWeekDay + 1));
        const weekStart = new Date();
        weekStart.setDate(weekEnd.getDate() - todayWeekDay);
        high = weekEnd;
        low = weekStart;
      }
      break;

    case "lastmonth":
      {
        const monthEnd = new Date();
        monthEnd.setDate(0);
        const monthStart = new Date();
        monthStart.setDate(0);
        monthStart.setDate(1);
        high = monthEnd;
        low = monthStart;
      }
      break;

    case "today":
    default:
      //Don't bother today's date is already set as high and low
      break;
  }

  //End of the day
  high.setHours(23, 59, 59, 59);

  //Start of the day
  low.setHours(0, 0, 0, 0);

  const query = { [path]: { $lte: high, $gte: low } };
  return query;
};

export function buildFormData(
  formData: FormData,
  headers: IAny,
  data: Record<string, any>,
  parentKey = ""
): void {
  for (const key in data) {
    const value = data[key];
    if (value === undefined || value === null) continue;

    const formKey =
      value instanceof File
        ? parentKey || key
        : parentKey
        ? `${parentKey}[${key}]`
        : key;

    if (value instanceof File) {
      formData.append(formKey, value);
      headers["Content-Type"] = "multipart/formdata";
    } else if (value instanceof FileList) {
      for (const file of value) {
        formData.append(formKey, file);
      }
      headers["Content-Type"] = "multipart/formdata";
    } else if (Array.isArray(value)) {
      value.forEach((item, i) =>
        buildFormData(formData, headers, { [i]: item }, formKey)
      );
    } else if (typeof value === "object") {
      buildFormData(formData, headers, value, formKey);
    } else {
      formData.append(formKey, value);
    }
  }
}
