import * as React from "react";
import { Button, Menu } from "react-native-paper";

export default function SelectExample() {
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("Escolha uma opção");

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button mode="outlined" onPress={() => setVisible(true)}>
          {selected}
        </Button>
      }
    >
      <Menu.Item
        onPress={() => {
          setSelected("Opção 1");
          setVisible(false);
        }}
        title="Opção 1"
      />
      <Menu.Item
        onPress={() => {
          setSelected("Opção 2");
          setVisible(false);
        }}
        title="Opção 2"
      />
      <Menu.Item
        onPress={() => {
          setSelected("Opção 3");
          setVisible(false);
        }}
        title="Opção 3"
      />
    </Menu>
  );
}
