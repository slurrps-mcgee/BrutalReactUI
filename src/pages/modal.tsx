import { useState } from "react";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "../../lib/main";
import { modalNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ModalPage() {
  const [open, setOpen] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);
  const [status, setStatus] = useState("No release published.");

  return (
    <Container title="Modal" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        A modal traps focus, closes with Escape, and returns focus to the
        control that opened it. The scrim is the page behind the dialog.
      </p>

      <Example
        imports="Button, Modal, ModalHeader, ModalClose, ModalBody, ModalFooter"
        title="Animated dialog"
        summary="animate, rounded, shadow, and border on the dialog pass to the buttons. rounded false on Publish keeps that button square."
        code={`<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal open={open} onOpenChange={setOpen} animate rounded>
  <ModalHeader>
    <span>Confirm publication</span>
    <ModalClose />
  </ModalHeader>
  <ModalBody>Publish this release now?</ModalBody>
  <ModalFooter>
    <ModalClose>Cancel</ModalClose>
    <Button rounded={false} onClick={() => setOpen(false)}>Publish</Button>
  </ModalFooter>
</Modal>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setOpen(true)}>Open modal</Button>
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
            <ModalClose>Cancel</ModalClose>
            <Button
              rounded={false}
              onClick={() => {
                setStatus("Release published.");
                setOpen(false);
              }}
            >
              Publish
            </Button>
          </ModalFooter>
        </Modal>
      </Example>

      <Example
        imports="Modal, ModalHeader, ModalClose, ModalBody"
        title="Static dialog"
        summary="animate false opens the dialog without the border draw or the pop."
        code={`<Modal open={open} onOpenChange={setOpen} animate={false} variant="secondary">
  <ModalHeader>
    <span>Static modal</span>
    <ModalClose />
  </ModalHeader>
  <ModalBody>This version opens without the animation.</ModalBody>
</Modal>`}
      >
        <Button
          variant="secondary"
          className="self-start"
          onClick={() => setStaticOpen(true)}
        >
          Open static modal
        </Button>
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
      </Example>

      <ComponentNotes {...modalNotes} />
    </Container>
  );
}
