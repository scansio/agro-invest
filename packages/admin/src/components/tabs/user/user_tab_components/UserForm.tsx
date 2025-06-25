import Reblend, { useState, useEffect, useRef } from "reblendjs";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Spinner from "../../../general/Spinner";
import { CREATE_USER } from "../../../../utils/RestEndpoints";
import fetcher from "../../../../utils/SharedFetcher";
import { ACTIVE, HOTLISTED, INACTIVE } from "../../../../utils/contants";
import { FormEvent } from "react";

function UserForm(props: {
  data: any;
  setData: (arg0: any) => any;
  setReload: () => any;
}) {
  const dataIdRef = useRef("");

  const [isUpdate, setIsUpdate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("END_USER");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const data = props.data;
    if (data) {
      dataIdRef.current = data._id;
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setEmail(data.email);
      setRole(data.role);
      setStatus(data.status);
      setType(data.type);
      setIsUpdate(true);
    }
  }, [props.data]);

  async function createUser(e: FormEvent<HTMLFormElement>) {
    setSubmitting(true);
    e.preventDefault();

    const gdFetchOption = {
      url: CREATE_USER,
      data: {
        firstname,
        lastname,
        email,
        role,
        type,
        status,
      },
    };
    let data;
    try {
      data = await fetcher.fetch(gdFetchOption);
    } catch (er) {
      toast.error(er.message);
    }
    if (data) {
      if (!data?.connection?.status) {
        toast.error(data?.connection?.message);
      } else {
        props.setData && props.setData(data.data.created);
        props.setReload && props.setReload();
        toast.success(data?.connection?.message);
      }
    }
    setSubmitting(false);
  }

  async function updateUser(e: FormEvent<HTMLFormElement>) {
    setSubmitting(true);
    e.preventDefault();
    const gdFetchOption = {
      url: CREATE_USER,
      method: "PATCH",
      data: {
        uid: dataIdRef.current,

        firstname,
        lastname,
        email,
        role,
        type,
        status,
      },
    };
    let data;
    try {
      data = await fetcher.fetch(gdFetchOption);
    } catch (er) {
      toast.error(er.message);
    }
    if (data) {
      if (!data?.connection?.status) {
        toast.error(data?.connection?.message);
      } else {
        props.setData && props.setData(data.data.created);
        props.setReload && props.setReload();
        toast.success(data?.connection?.message);
      }
    }
    setSubmitting(false);
  }

  return (
    <Form onSubmit={(e) => (isUpdate ? updateUser(e) : createUser(e))}>
      <Row>
        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Firstname</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value?.trim())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Lastname</InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value?.trim())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Email </InputGroup.Text>
            <Form.Control
              required={true}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value?.trim()?.toLowerCase())}
            />
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Privilege/Role
            </InputGroup.Text>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option key="first" value="">
                Select privilege
              </option>
              <option key="user" value={"END_USER"}>
                Normal User
              </option>
              <option key="admin" value={"ADMIN"}>
                Manager/Admin
              </option>
              <option key="developer" value={"DEVELOPER"}>
                Developer
              </option>
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Type</InputGroup.Text>
            <Form.Select
              //required={true}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option key="first" value="">
                Select User type
              </option>
              {[
                { name: "DRIVER", value: "DRIVER" },
                { name: "PASSENGER", value: "PASSENGER" },
              ].map((pos) => (
                <option key={pos.name} value={pos.value}>
                  {pos.name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Status</InputGroup.Text>
            <Form.Select
              //required={true}
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value))}
            >
              <option key="first" value="">
                Select Status
              </option>
              {[
                { name: "ACTIVE", value: ACTIVE },
                { name: "INACTIVE", value: INACTIVE },
                { name: "HOTLISTED", value: HOTLISTED },
              ].map((stat) => (
                <option key={stat.name} value={stat.value}>
                  {stat.name}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>

        <Col xs="12" className="p-1">
          <Spinner
            loading={submitting}
            loadingText={`${isUpdate ? "Updating user" : "Creating user"}`}
          >
            <Form.Control
              size="md"
              type="submit"
              value={`${isUpdate ? "Update" : "Create"}`}
              className="fw-bold utilityLink"
            />
          </Spinner>
        </Col>
      </Row>
    </Form>
  );
}
export default UserForm;
