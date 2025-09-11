import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Navbar,
  Nav,
  Alert,
  Spinner,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  FiUploadCloud,
  FiSend,
  FiFileText,
  FiBook,
  FiGithub,
  FiHome,
  FiInfo,
} from "react-icons/fi";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const displayAlert = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      displayAlert("Please select at least one file.", "warning");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      displayAlert(
        "Files uploaded successfully: " + res.data.files_processed.join(", ")
      );
      setFiles([]);
    } catch (err) {
      console.error(err);
      displayAlert("Upload failed!", "danger");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      displayAlert("Please enter a question.", "warning");
      return;
    }

    try {
      setAnswer(""); // Clear previous answers
      setContext("");

      const res = await axios.get("http://localhost:8000/ask/", {
        params: { q: question },
      });
      setAnswer(res.data.answer);
      setContext(res.data.context);
    } catch (err) {
      console.error(err);
      displayAlert("Error fetching answer.", "danger");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk(e);
    }
  };

  return (
    <>
      {/* Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home">
            <FiBook className="me-2" /> DocuMate
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">
                <FiHome /> Home
              </Nav.Link>
              <Nav.Link href="#about">
                <FiInfo /> About
              </Nav.Link>
              <Nav.Link
                href="https://github.com/Sid2318/DocuMate"
                target="_blank"
              >
                <FiGithub /> GitHub
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="main-content">
        <Container>
          {/* Alerts */}
          {showAlert && (
            <Alert
              variant={alertVariant}
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          {/* Header */}
          <Row className="mb-4">
            <Col>
              <h1 className="text-center mb-3">📚 DocuMate - RAG Agent</h1>
              <p className="text-center text-muted">
                Upload documents and ask questions to get AI-powered answers
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            {/* File Upload Section */}
            <Col md={5}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    <FiUploadCloud className="me-2" /> Upload Documents
                  </h5>
                </Card.Header>
                <Card.Body>
                  <label className="custom-file-upload d-block mb-3">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="d-none"
                    />
                    <div className="text-center py-4">
                      <FiUploadCloud size={40} className="text-primary mb-2" />
                      <p className="mb-0">Drag files here or click to browse</p>
                      <small className="text-muted">
                        Supports PDF, PPTX, TXT, etc.
                      </small>
                    </div>
                  </label>

                  <Button
                    variant="primary"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                  >
                    {uploading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="me-2" /> Upload Files
                      </>
                    )}
                  </Button>

                  {files.length > 0 && (
                    <div className="mt-3">
                      <h6>Selected Files ({files.length})</h6>
                      <ListGroup variant="flush" className="file-list">
                        {files.map((file, index) => (
                          <ListGroup.Item key={index} className="py-2">
                            <FiFileText className="me-2 text-primary" />
                            {file.name}
                            <Badge bg="secondary" pill className="ms-2">
                              {(file.size / 1024).toFixed(0)} KB
                            </Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Q&A Section */}
            <Col md={7}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    <FiBook className="me-2" /> Ask Questions
                  </h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <div className="chat-container mb-3 flex-grow-1">
                    {answer ? (
                      <div className="answer-container p-3">
                        <h5 className="text-primary mb-2">Answer:</h5>
                        <p className="mb-3" style={{ whiteSpace: "pre-line" }}>
                          {answer}
                        </p>

                        {context && (
                          <div className="mt-3 pt-2 border-top">
                            <h6 className="text-muted mb-1">Source Context:</h6>
                            <p className="small text-muted">{context}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted h-100 d-flex flex-column justify-content-center">
                        <FiBook
                          size={48}
                          className="mx-auto mb-3 text-secondary"
                        />
                        <p>Upload documents and ask questions to get started</p>
                      </div>
                    )}
                  </div>

                  <Form onSubmit={handleAsk} className="mt-auto">
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Ask a question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="question-input me-2"
                      />
                      <Button type="submit" variant="success">
                        <FiSend />
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="app-footer text-center">
        <Container>
          <p className="mb-0">
            © {new Date().getFullYear()} DocuMate RAG Agent | All rights
            reserved
          </p>
        </Container>
      </footer>
    </>
  );
}

export default App;
