import React, { useState, useEffect, useRef } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextComponent,
  View,
  Platform,
  StatusBar,
  Button,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Header } from "react-native-elements";
import io from "socket.io-client";

export default function App() {
  const [roomId, setRoomId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef();
  const [name, setName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [emojiDialog, setEmojiDialog] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    // getUser();
    //setOpen(true);
    socketRef.current = io.connect("http://192.168.0.107:5000");
    socketRef.current.on("room id", (id) => {
      setRoomId(id);
      console.log(id);
    });

    socketRef.current.on("message", (msg) => {
      receiveMsg(msg);
    });
  }, []);

  function receiveMsg(msg) {
    setMessages((prevMsg) => [...prevMsg, msg]);
  }
  function sendMessage(e) {
    e.preventDefault();
    const messageObj = {
      body: message,
      date: new Date().toLocaleTimeString(),
      user: name,
      id: roomId,
    };
    setMessage("");
    socketRef.current.emit("send message", messageObj);
  }

  // const getUser = async () => {
  //   setLoading(true);
  //   let user = await localStorage.getItem('sender');
  //   if (user) {
  //     setName(user);
  //     setLoading(false);
  //   } else {
  //     setName();
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ backgroundColor: "#1976d2" }}>
          <Text style={{ padding: 16, color: "white", fontSize: 25 }}>
            Chat
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={messages.reverse()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: "100%",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: item.id == roomId ? "#e0e0e0" : "#1976d2",
                    borderRadius: 20,
                    padding: 16,
                    marginLeft: item.id == roomId ? "auto" : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: item.id == roomId ? "black" : "white",
                    }}
                  >
                    {item.body}
                  </Text>
                </View>
              </View>
            )}
            inverted
            keyExtractor={(item, index) => index.toString()}
            extraData={messages}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: 100,
            backgroundColor: "#03A9F4",
            flexDirection: "row",
          }}
        >
          <TextInput
            onChangeText={(text) => setMessage(text)}
            style={{
              backgroundColor: "white",
              color: "black",
              width: "80%",
              zIndex: 4,
              borderRadius: 40,
              height: 50,
              padding: 15,
              alignSelf: "center",
            }}
            value={message}
          />

          <Pressable style={styles.button} onPress={sendMessage}>
            <Text style={styles.text}>></Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",

    elevation: 3,
    backgroundColor: "red",
    height: 60,
    width: 60,
    alignSelf: "center",

    borderRadius: 50,
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
