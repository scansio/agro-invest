import Reblend, { useMemo, useState } from "reblendjs";

import { Card, Col, Form, NavItem } from "react-bootstrap";
import { useLocation } from "reblend-router";
import Config from "../components/tabs/git/Config";
import Fetcher from "../utils/Fetcher";
import { toast } from "react-toastify";

function Git(_props) {
  const location = useLocation();
  const tab = new URLSearchParams(location?.search)?.get("tab");
  const [output, setOutput] = useState("");
  const [url, setUrl] = useState("https://api.hotel-managementai.com:3002");
  const [repo, setRepo] = useState("hotel-management-backend-production");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [syncing, setSyncing] = useState(false);
  const fetcher = useMemo(() => new Fetcher(url, false), [url]);

  function sync(e) {
    e.preventDefault();
    if (!repo) {
      toast.error("Enter Repository Name");
      return;
    }
    setSyncing(true);
    fetcher
      .fetch(url + "/sync/" + repo)
      .then((data) => {
        setOutput(data);
        setSyncing(false);
      })
      .catch((error) => {
        setOutput(error.message);
        setSyncing(false);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col xs="12">
          <Card>
            <Card.Footer className="mt-0 pt-0 mx-1 px-1">
              <Nav variant="pills" className="s-grid">
                <NavItem>
                  <Link
                    to="../git?tab=action"
                    className={`nav-link ${
                      !tab || tab === "action" ? "active" : ""
                    }`}
                  >
                    Actions
                  </Link>
                </NavItem>

                <NavItem>
                  <Link
                    to="../git?tab=config"
                    className={`nav-link ${tab === "config" ? "active" : ""}`}
                  >
                    Config
                  </Link>
                </NavItem>
              </Nav>
            </Card.Footer>
          </Card>
        </Col>

        <Col xs="12" sm="12" md="8" lg="9" className="mt-3">
          <Col xs="12" className="mt-3">
            <Card>
              <Card.Header className="mt-0 pt-0">
                <Row>
                  <Form>
                    <Col xs="12" className="p-1">
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">
                          URL
                        </InputGroup.Text>
                        <Form.Control
                          required={true}
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        ></Form.Control>
                      </InputGroup>
                    </Col>

                    <Col xs="12" className="p-1">
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">
                          Repo
                        </InputGroup.Text>
                        <Form.Control
                          required={true}
                          type="text"
                          value={repo}
                          onChange={(e) => setRepo(e.target.value)}
                        ></Form.Control>
                      </InputGroup>
                    </Col>

                    <Col xs="12" className="p-1">
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">
                          Username
                        </InputGroup.Text>
                        <Form.Control
                          required={true}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoComplete={"false"}
                        ></Form.Control>
                      </InputGroup>
                    </Col>

                    <Col xs="12" className="p-1">
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">
                          Password
                        </InputGroup.Text>
                        <Form.Control
                          required={true}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete={"false"}
                        ></Form.Control>
                      </InputGroup>
                    </Col>

                    <Col xs="12" md="6" lg="6" className="p-1 pull-right">
                      <Spinner loading={syncing} loadingText="Syncing">
                        <Button onClick={sync} className="fw-bold utilityLink">
                          Sync
                        </Button>
                      </Spinner>
                    </Col>
                  </Form>
                </Row>
              </Card.Header>
            </Card>
          </Col>

          <Col xs="12" className="mt-3">
            <Card>
              <Card.Body>
                {tab === "config" ? (
                  <Config
                    username={username}
                    password={password}
                    repo={repo}
                    setOutput={setOutput}
                    url={url}
                    fetcher={fetcher}
                  />
                ) : (
                  <Action
                    username={username}
                    password={password}
                    repo={repo}
                    setOutput={setOutput}
                    url={url}
                    fetcher={fetcher}
                  />
                )}
              </Card.Body>
              <Card.Footer style={{ background: "gainsboro" }}>
                <div>
                  <h2 className="text-center mb-3">Output</h2>
                  <pre>
                    <code>{output}</code>
                  </pre>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}
export default Git;
