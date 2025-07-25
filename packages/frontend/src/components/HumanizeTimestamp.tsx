import Reblend, { useMemo } from "reblendjs";
import {
  formatDistance,
  FormatDistanceOptions,
  formatDistanceToNow,
  FormatDistanceToNowOptions,
} from "date-fns";

const HumanizeTimestamp = ({
  timestamp,
  options,
}: {
  timestamp: string | number | Date;
  options?: FormatDistanceToNowOptions | undefined;
}) => {
  const timeString = useMemo(() => {
    let t = timestamp;
    if (!(t instanceof Date)) {
      t = new Date(t);
    }
    const timeStringTemp = formatDistanceToNow(t, {
      addSuffix: true,
      ...options,
    });
    return timeStringTemp;
  }, [timestamp]);

  return <span className="text-center">{timeString}</span>;
};

const Humanize = ({
  laterDate,
  earlierDate,
  options,
}: {
  laterDate: string | number | Date;
  earlierDate: string | number | Date;
  options?: FormatDistanceOptions | undefined;
}) => {
  return (
    <span className="text-center">
      {formatDistance(laterDate, earlierDate, options)}
    </span>
  );
};

export default HumanizeTimestamp;
export { Humanize };
