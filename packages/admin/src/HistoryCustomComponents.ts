import { IAny } from "reblendjs";

export const HistoryCustomComponents: {
  [key: string]: (props: {
    rowData: IAny;
    setReload: (val: string | number) => {};
  }) => Reblend.JSX.Element;
} = {};
