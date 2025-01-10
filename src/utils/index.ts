import { SelectOptions } from "../types";

export const joinQueryValues = (
  data: readonly SelectOptions[],
  key: "value" | "label",
  withQuotes: boolean = true,
  separator: string = " "
): string => data.map((item: SelectOptions) => (withQuotes ? `"${item[key]}"` : item[key])).join(separator);
