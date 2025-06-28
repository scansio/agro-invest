import Reblend, {
  CSSProperties,
  IAny,
  useEffect,
  useMemo,
  useState,
} from "reblendjs";
import { alertError, encodeQuery } from "../lib/misc";
import IPaginatingMetadata from "../interfaces/IPaginatingMetadata";
import fetcher from "../lib/SharedFetcher";
import IPaginating from "../interfaces/IPaginating";
import { DATA_FETCH_LIMIT } from "../lib/contants";

function Paginator<T>(props: {
  query: IAny;
  url: string;
  setRaw?: (val: any) => any;
  setData?: (val: any) => any;
  setLoading?: (loading: boolean) => any;
  setResults: (results: T[]) => any;
  setLoadingError?: (errored: boolean) => any;
  reload?: string;
  noPaginator?: string;
  size?: number;
  hidden?: boolean;
  style?: CSSProperties;
}) {
  const [queryString, setQueryString] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<IPaginatingMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.query) {
      const qs = encodeQuery(props.query);
      setQueryString(qs);
      setUrl(`${props.url}?q=${qs}&size=${props.size || 10}`);
    }
  }, [props.query, props.url]);

  useEffect(() => {
    if (!url) {
      return;
    }

    setLoading(true);
    props?.setLoading && props?.setLoading(true);

    fetcher
      .fetch<IPaginating<T>>(url)
      .then((data) => {
        if (data?.connection?.status) {
          props.setRaw && props.setRaw(data);
          props.setData && props.setData(data?.data?.results || []);
          props.setResults && props.setResults(data?.data?.results || []);
          setMetadata(data?.data?.metadata!);
        } else {
          props.setLoadingError && props.setLoadingError(true);
          alertError(data?.connection?.message);
          props.setRaw && props.setRaw(data);
          props.setData && props.setData([]);
          props.setResults && props.setResults([]);
          setMetadata(data?.data?.metadata!);
        }
      })
      .catch((er) => {
        props.setResults && props.setResults([]);
        props.setLoadingError && props.setLoadingError(false);
        alertError((er as any)?.message);
      })
      .finally(() => {
        props?.setLoading && props?.setLoading(false);
        setLoading(false);
      });
  }, [url, props.reload]);

  const renderer = useMemo(() => {
    if (metadata && !props.noPaginator) {
      const firstPageUrl = `${props.url}?page=${1}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const previousPageUrl = `${props.url}?page=${
        metadata.previousPage
      }&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const nextPageUrl = `${props.url}?page=${metadata.nextPage}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const lastPageUrl = `${props.url}?page=${metadata.totalPages}&size=${
        props.size
          ? props.size
          : metadata?.size
          ? metadata.size
          : DATA_FETCH_LIMIT
      }&q=${queryString}`;

      const groups: Reblend.JSX.Element[] = [];
      const leftMeta: Reblend.JSX.Element[] = [];
      const rightMeta: Reblend.JSX.Element[] = [];
      /* 
      leftMeta.push(
        getButton({
          children: "<<<",
          disabled: !metadata.hasPrevious || loading,
          onClick: () => setUrl(firstPageUrl),
          key: firstPageUrl,
        })
      ); */

      leftMeta.push(
        <li class="inflanar-pagination_button" key={previousPageUrl}>
          <a
            href="#"
            onclick={(e) => {
              e.preventDefault();
              metadata.hasPrevious && setUrl(previousPageUrl);
            }}
            style="height: 40px; height: 40px;"
          >
            <i class="fas fa-angle-left"></i>
          </a>
        </li>
      );

      rightMeta.push(
        <li class="inflanar-pagination_button" key={nextPageUrl}>
          <a
            href="#"
            onclick={(e) => {
              e.preventDefault();
              metadata.hasNext && setUrl(nextPageUrl);
            }}
            style="height: 40px; height: 40px;"
          >
            <i class="fas fa-angle-right"></i>
          </a>
        </li>
      );

      /*       rightMeta.push(
        getButton({
          children: ">>>",
          disabled: !metadata.hasNext || loading,
          onClick: () => setUrl(lastPageUrl),
          key: lastPageUrl,
        })
      ); */

      groups.push(...leftMeta);

      let pagenums: Reblend.JSX.Element[] = [];

      for (let page = 1; page <= metadata.totalPages; page++) {
        const pageUrl = `${props.url}?page=${page}&size=${
          props.size
            ? props.size
            : metadata?.size
            ? metadata.size
            : DATA_FETCH_LIMIT
        }&q=${queryString}`;

        const isActive = `${page === metadata.currentPage ? "active" : ""}`;

        // Trying to remove previous page button
        if (isActive && page > 10) {
          pagenums = [];
        }
        pagenums.push(
          <li class={isActive} key={page}>
            <a
              href="#"
              onclick={(e) => {
                e.preventDefault();
                !isActive && setUrl(pageUrl);
              }}
              style="height: 40px; height: 40px;"
            >
              {page}
            </a>
          </li>
        );
      }

      // Trying to limit number of buttons to 10
      if (pagenums.length > 10) {
        pagenums.length = 10;
      }

      groups.push(...pagenums);

      groups.push(...rightMeta);

      /* leftMeta.push(
        <span
          key="page-info"
          className="text-xs badge bg-warning font-xs"
        >{`P${metadata.currentPage} ${metadata.resultCount}/${metadata.totalResults}T`}</span>
      );
 */
      return groups;
    }
  }, [metadata]);

  return metadata?.totalPages! > 1 ? (
    <div
      className="d-flex justify-content-between align-items-end my-10"
      style={{
        overflowX: "auto",
        display: props.hidden ? "none" : "initial",
        ...props.style,
      }}
    >
      <div class="inflanar-pagination">
        <ul class="inflanar-pagination_list list-none">{renderer}</ul>
      </div>
    </div>
  ) : null;
}

export default Paginator;
