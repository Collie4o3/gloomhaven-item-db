import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { useFilterOptions } from "../../Providers/FilterOptionsProvider";

const ImportData = () => {
    const [isOpen, setIsOpen] = useState(location.hash && location.hash.substr(1).length > 0 || false);
    const { loadFromHash } = useFilterOptions();

  return (
    <Modal basic size="small" open={isOpen}>
      <Header icon="cloud download" content="Apply Configuration from Link" />
      <Modal.Content>
        <p>Do you want to load the configuration passed with this link?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={() => {
            location.hash = "";
            setIsOpen(false);
          }}
        >
          <Icon name="remove" /> No
        </Button>
        <Button color="green" inverted onClick={() => {
            loadFromHash()
            setIsOpen(false);
        }}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ImportData;
