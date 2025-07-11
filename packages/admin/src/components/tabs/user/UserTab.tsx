import Reblend, { useRef, useState } from "reblendjs";
import { Button, ButtonGroup } from "react-bootstrap";
import PaginatedTable from "../../paginating/PaginatedTable";
import ModalBox from "../../general/Modal";
import { toast } from "react-toastify";
import UserForm from "./user_tab_components/UserForm";
import { FaTrash } from "react-icons/fa";
import { ALL_USER, CREATE_USER } from "../../../utils/RestEndpoints";
import fetcher from "../../../utils/SharedFetcher";

(FaTrash as any).props = { reactcomponent: true };

function UserTab() {
  const [reload, setReload] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemId, setItemId] = useState("");
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [updatingData, setUpdatingData] = useState(null);

  const reffer = () => useRef(null);
  const urlRef = useRef(ALL_USER);
  async function deleteUser(userId) {
    const fetchData = {
      url: CREATE_USER + "/" + userId,
      method: "DELETE",
    };
    let data = null;
    try {
      data = await fetcher.fetch(fetchData);
    } catch (er) {
      toast.error(er.message);
    }
    if (!data?.connection?.status) {
      toast.error(data?.connection?.message);
    } else {
      setShowConfirmDeletion(false);
      setReload(!reload);
      toast.success(data?.connection?.message);
    }
  }

  function out(rowData, rowIndex) {
    return (
      <ButtonGroup size="sm">
        <Button
          onClick={() => {
            setItemId(rowData._id);
            setShowConfirmDeletion(true);
          }}
          style={{ padding: "5px" }}
          title="Delete this user"
          variant="danger"
        >
          <FaTrash />
        </Button>
        <Button
          onClick={() => {
            setUpdatingData(rowData);
            setShowCreateForm(true);
          }}
          style={{ padding: "5px" }}
          title="Edit this user"
          variant="warning"
        >
          <i className="fas fa-edit"></i>
        </Button>
      </ButtonGroup>
    );
  }

  function createUserButton() {
    return (
      <>
        <Button
          onClick={() => setShowCreateForm(true)}
          style={{ padding: "5px", fontSize: "11px" }}
        >
          Add
        </Button>
      </>
    );
  }

  const fieldRef = useRef({
    _id: { name: "UID", type: Number },
    refID: { name: "refID", type: Number },
    firstname: { name: "Firstname", type: String },
    lastname: { name: "Lastname", type: String },
    email: { name: "Email", type: Number },
    role: {
      name: "Role",
      type: String,
    },
    rating: {
      name: "Rating",
      type: String,
    },
    oauth: {
      name: "Oauth",
      type: String,
    },
    verifiedUser: {
      name: "Verified User",
      type: String,
    },
    verifiedDriver: {
      name: "Verified Driver",
      type: String,
    },
    expoToken: {
      name: "Expo Push Token",
      type: String,
    },
    avatar: {
      name: "Avatar",
      type: String,
    },
    type: {
      name: "Type",
      type: String,
    },
    status: { name: "Status", type: String },
    "createdAt.date": { name: "Created", type: Date },
    "updatedAt.date": { name: "Updated", type: Date, hideFromSearch: true },
    action: {
      name: createUserButton,
      type: String,
      virtual: true,
      transform: { out },
    },
  });

  return (
    <>
      <ModalBox
        show={showConfirmDeletion}
        onCancel={() => setShowConfirmDeletion(false)}
        onAccept={() => deleteUser(itemId)}
        header={<h1 className="text-center">Confirm Deletion</h1>}
        type="danger"
        backdrop
      >
        <span>Are Sure you want to delete this user</span>
      </ModalBox>

      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false);
          setUpdatingData(null);
        }}
        control={false}
        header={
          <h2 className="text-center">{`${
            updatingData ? "Update" : "Create"
          } User`}</h2>
        }
        backdrop
      >
        <UserForm setReload={(e) => setReload(!reload)} data={updatingData} />
      </ModalBox>

      <PaginatedTable
        url={urlRef.current}
        dataName="users"
        fields={fieldRef.current}
        primaryKey="firstname"
        /* setData={data => setData(data)} */ forCurrentUser={false}
        reload={reload}
      />
    </>
  );
}

export default UserTab;
