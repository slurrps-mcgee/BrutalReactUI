import { useState } from "react";
import {
  Button,
  CodeSnippet,
  Container,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "../../lib/main";

const modalCode = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal open={open} onOpenChange={setOpen} animate rounded>
  <ModalHeader>
    <span>Confirm publication</span>
    <ModalClose />
  </ModalHeader>
  <ModalBody>Publish this release now?</ModalBody>
  <ModalFooter>
    <ModalClose>Cancel</ModalClose>
    <Button onClick={() => setOpen(false)}>Publish</Button>
  </ModalFooter>
</Modal>`;

export default function ModalPage() {
  const [open, setOpen] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);
  const [status, setStatus] = useState("No release published.");

  return (
    <Container title="Modal" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        The dialog traps focus, closes with Escape, and returns focus to the
        control that opened it.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Button variant="secondary" onClick={() => setStaticOpen(true)}>
          Open static modal
        </Button>
        <span role="status" className="font-mono text-sm">
          {status}
        </span>
      </div>

      <Modal open={open} onOpenChange={setOpen} animate rounded>
        <ModalHeader>
          <span className="text-lg uppercase">Confirm publication</span>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          <p className="font-sans font-normal">
            Publish this release now? This demo action only updates the status
            on this page.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose className="px-3 py-2">Cancel</ModalClose>
          <Button
            onClick={() => {
              setStatus("Release published.");
              setOpen(false);
            }}
          >
            Publish
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        open={staticOpen}
        onOpenChange={setStaticOpen}
        animate={false}
        variant="secondary"
      >
        <ModalHeader>
          <span className="text-lg uppercase">Static modal</span>
          <ModalClose />
        </ModalHeader>
        <ModalBody>
          <p className="font-sans font-normal">
            This version opens without the border or pop animation.
          </p>
        </ModalBody>
      </Modal>

      <CodeSnippet code={modalCode} language="tsx" rounded />
    </Container>
  );
}
