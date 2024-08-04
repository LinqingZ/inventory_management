"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    if (!item) return;
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    if (!item) return;
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        padding={4}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100vw"
            height="100vh"
          >
            <Box
              width={400}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <Typography variant="h6">Add Item</Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value.toLowerCase());
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (itemName.trim()) {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Modal>
        <Typography variant="h1">Inventory Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <Paper elevation={3} sx={{ width: "800px", padding: 2 }}>
          <Box
            width="100%"
            height="100px"
            display="flex"
            bgcolor="#ADD8E6"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Typography variant="h2" color="#333">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" height="300px" spacing={2} overflow="auto">
            {inventory.map(({ name, quantity }) => (
              <Paper
                key={name}
                elevation={1}
                sx={{
                  width: "100%",
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  bgcolor: "#f0f0f0",
                }}
              >
                <Typography variant="h2" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h2" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addItem(name);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}