import { Row, Col, Form, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Reblend, {
  useState,
  useEffect,
  useMemo,
  useRef,
  HTMLFormElement,
  IAny,
} from "reblendjs";
import fetcher from "../../utils/SharedFetcher";
import Spinner from "../general/Spinner";
import { FormEvent } from "react";
import { IControllerRoute } from "../../interfaces/IControllerRoute";
import { RequestMethods } from "../../interfaces/RequestMethods";
import { IRouteFieldOption } from "../../interfaces/IRouteFieldType";
import { buildFormData } from "../../scripts/misc";
import { AxiosHeaders } from "axios";

const ignoredFieldDictionary = {
  _id: 1,
  __v: 1,
  createdAt: 1,
  updatedAt: 1,
  "createdAt.date": 1,
  "updatedAt.date": 1,
};

const shouldIgnore = (key: string) => !!ignoredFieldDictionary[key as "_id"];

export default function HistoryComponentsForm({
  controllerRoute,
  updates,
  setChange = () => {},
  setReload = () => {},
}: {
  controllerRoute: IControllerRoute;
  updates?: any;
  setChange?: (data: any) => void;
  setReload?: () => void;
}) {
  const dataIdRef = useRef("");
  const [formData, setFormData] = useState<any>(updates || {});
  const [jsonParseError, setJsonParseError] = useState<{
    key: string;
    message: string;
    value: string;
  } | null>(null);
  const [isUpdate, setIsUpdate] = useState(!!updates);
  const [submitting, setSubmitting] = useState(false);

  const formResetRef = useRef<HTMLButtonElement>(null as any);

  const setData = ({ key, value }: { key: string; value: any }) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const operateArray = (
    key: string,
    op: "insert" | "remove" | "put",
    index?: number,
    value?: any
  ) => {
    const arr = Array.isArray(formData[key])
      ? [...formData[key]]
      : [formData[key] ?? ""];
    if (op === "insert") arr.push("");
    else if (op === "remove" && index !== undefined) arr.splice(index, 1);
    else if (op === "put" && index !== undefined) arr[index] = value;
    setData({ key, value: arr });
  };

  const getFormControl =
    (key: string, options?: IRouteFieldOption) => (value: any) => {
      let control: JSX.Element | JSX.Element[] = <></>;

      switch (options?.type) {
        case "string":
        case "text":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              type="text"
              value={value ?? ""}
              minLength={options.minLength}
              maxLength={options.maxLength}
              onChange={(e) => setData({ key, value: e.target.value })}
            />
          );
          break;

        case "number":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              type="number"
              value={value ?? 0}
              min={options.min}
              max={options.max}
              onChange={(e) => setData({ key, value: Number(e.target.value) })}
            />
          );
          break;

        case "email":
        case "password":
        case "url":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              type={options.type}
              value={value ?? ""}
              onChange={(e) => setData({ key, value: e.target.value })}
            />
          );
          break;

        case "date":
        case "time":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              type={options.type}
              value={value ?? ""}
              onChange={(e) => setData({ key, value: e.target.value })}
            />
          );
          break;

        case "textarea":
          control = (
            <textarea
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              style={{ height: "100px" }}
              value={value ?? ""}
              onChange={(e) => setData({ key, value: e.target.value })}
            />
          );
          break;

        case "checkbox":
        case "radio":
        case "boolean":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              type={options.type}
              className="form-check-input"
              checked={!!value}
              onChange={(e) =>
                setData({
                  key,
                  value:
                    key === "status"
                      ? e.target.checked
                        ? 1
                        : 0
                      : e.target.checked,
                })
              }
            />
          );
          break;

        case "switch":
          control = (
            <Form.Switch
              required={options.required}
              readOnly={options.readOnly}
              checked={!!value}
              onChange={(e) =>
                setData({
                  key,
                  value:
                    key === "status"
                      ? e.target.checked
                        ? 1
                        : 0
                      : e.target.checked,
                })
              }
            />
          );
          break;

        case "select":
          control = (
            <select
              value={value ?? ""}
              className="form-control"
              onChange={(e) => setData({ key, value: e.target.value })}
            >
              {options.options?.map(({ label, value: optValue }) => (
                <option key={optValue} value={optValue}>
                  {label}
                </option>
              ))}
            </select>
          );
          break;

        case "object":
          control = (
            <>
              <textarea
                required={options.required}
                readOnly={options.readOnly}
                className="form-control"
                value={
                  jsonParseError?.key === key
                    ? jsonParseError.value
                    : JSON.stringify(value ?? {}, null, 2)
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setData({ key, value: parsed });
                    setJsonParseError(null);
                  } catch (err: any) {
                    setJsonParseError({
                      key,
                      message: err.message,
                      value: e.target.value,
                    });
                  }
                }}
              />
              {jsonParseError?.key === key ? (
                <p className="text-danger">{jsonParseError.message}</p>
              ) : null}
            </>
          );
          break;

        case "array":
          const arrValue = Array.isArray(value) ? value : [value ?? ""];
          control = arrValue.map((item, i) => (
            <div key={`${key}-${i}`} className="d-flex gap-2 mb-2">
              {options.itemOptions?.type === "object" ? (
                <textarea
                  required={options.required}
                  readOnly={options.readOnly}
                  className="form-control"
                  value={
                    jsonParseError?.key === key
                      ? jsonParseError.value
                      : JSON.stringify(item ?? {})
                  }
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      operateArray(key, "put", i, parsed);
                      setJsonParseError(null);
                    } catch (err: any) {
                      setJsonParseError({
                        key,
                        message: err.message,
                        value: e.target.value,
                      });
                    }
                  }}
                />
              ) : (
                <input
                  required={options.required}
                  readOnly={options.readOnly}
                  className="form-control"
                  value={item ?? ""}
                  onChange={(e) => operateArray(key, "put", i, e.target.value)}
                />
              )}
              <button
                type="button"
                class="btn btn-danger"
                tabIndex={0}
                onClick={() => operateArray(key, "remove", i)}
              >
                <i class="fas fa-trash" />
              </button>
            </div>
          ));
          break;

        case "file":
        case "image":
          control = (
            <input
              required={options.required}
              readOnly={options.readOnly}
              className="form-control"
              type="file"
              accept={options.accept}
              multiple={options.multiple}
              onChange={(e) =>
                setData({
                  key,
                  value: options.multiple
                    ? Array.from(e.target.files || [])
                    : e.target.files?.[0] ?? null,
                })
              }
            />
          );
          break;
      }

      return (
        <Col xs="12" className="p-2" key={key}>
          <div className="form-group">
            <div className="d-flex justify-content-between">
              <label className="fw-bold text-capitalize">{key}</label>
              {options?.type === "array" ? (
                <button
                  type="button"
                  class="btn btn-primary my-1"
                  onClick={() => operateArray(key, "insert")}
                  tabIndex={0}
                >
                  <i class="fas fa-plus" />
                </button>
              ) : null}
            </div>
            {options?.description ? (
              <small className="text-muted">{options.description}</small>
            ) : null}
            {control}
          </div>
        </Col>
      );
    };

  const fields = useMemo<
    { [key: string]: { options: IRouteFieldOption; ui: (value: any) => any } },
    any
  >(() => {
    const route = controllerRoute?.routes.find((r) =>
      isUpdate
        ? r.method === RequestMethods.PATCH
        : r.method === RequestMethods.POST
    );
    const formFields = route?.fields?.body ?? {};
    const fieldEntries: any = {};
    for (const [key, options] of Object.entries(formFields)) {
      if (shouldIgnore(key)) continue;
      fieldEntries[key] = {
        options,
        ui: getFormControl(key, options),
      };
    }
    return fieldEntries;
  }, [controllerRoute, updates]);

  const submit = (e: Reblend.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const method = isUpdate ? "PATCH" : "POST";
    const formPayload = {
      ...(isUpdate ? { _id: dataIdRef.current } : {}),
      ...formData,
    };
    const headers: IAny = {};

    const formDataObj = new FormData();
    buildFormData(formDataObj, headers, formPayload);

    fetcher
      .fetch({
        url: controllerRoute.baseUrl,
        method,
        headers,
        data: formDataObj,
      })
      .then((response) => {
        const msg = response?.connection?.message;
        if (!response?.connection?.status) toast.error(msg);
        else {
          toast.success(msg);
          setChange(response.data?.created);
          setReload();
          !isUpdate && formResetRef.current.click();
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    if (updates) {
      setFormData(updates);
      dataIdRef.current = updates._id;
      setIsUpdate(true);
    } else {
      setFormData({});
      setIsUpdate(false);
    }
  }, [updates]);

  return (
    <form className="form" onSubmit={submit}>
      <ToastContainer
        //newestOnTop={true}
        toastStyle={{ borderRadius: 20, padding: 5 }}
      />
      <Row>
        {Object.entries(fields).map(([key, { ui }]) => ui(formData[key]))}
        <Col xs="12" className="p-2">
          <Spinner
            loading={submitting}
            loadingText={`${isUpdate ? "Updating" : "Creating"}`}
          >
            <input
              type="submit"
              className="form-control fw-bold btn btn-primary text-white"
              value={isUpdate ? "Update" : "Create"}
            />
          </Spinner>
        </Col>
      </Row>
      <button type="reset" hidden ref={formResetRef} />
    </form>
  );
}
