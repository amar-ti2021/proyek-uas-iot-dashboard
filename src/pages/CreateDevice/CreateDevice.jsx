import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { Container, Flex, Heading, Input } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Alert } from "@/components/ui/alert";
const CreateDevice = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [nameErrorText, setNameErrorText] = useState("");
  const [latitudeErrorText, setLatitudeErrorText] = useState("");
  const [longitudeErrorText, setLongitudeErrorText] = useState("");

  const [alert, setAlert] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!name) {
      setNameErrorText("name is required.");
      isValid = false;
    } else {
      setNameErrorText("");
    }

    if (!latitude) {
      setLatitudeErrorText("latitude is required.");
      isValid = false;
    } else {
      setLatitudeErrorText("");
    }

    if (!longitude) {
      setLongitudeErrorText("longitude is required.");
      isValid = false;
    } else {
      setLongitudeErrorText("");
    }

    return isValid;
  };

  const handleCreateDevice = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setAlert(""); // Clear any existing alerts

    try {
      const { data, error } = await supabase.from("devices").insert([
        {
          name,
          latitude: parseFloat(latitude), // Ensure latitude is a float
          longitude: parseFloat(longitude), // Ensure longitude is a float
        },
      ]);

      setIsLoading(false);

      if (error) {
        throw error; // Handle the error
      }

      toaster.create({
        title: "Device saved",
        description: "Successfully created the device",
        type: "success",
        duration: 5000,
      });

      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        title: "Failed to save the Device",
        description: error.message,
        type: "error",
        duration: 5000,
      });
      setAlert(error.message);
    }
  };

  return (
    <Container fluid h="100vh">
      <Toaster />
      <Flex h="100%" justify="center" align="center">
        <Flex
          direction="column"
          rounded="md"
          shadow="lg"
          p={5}
          gap={3}
          w="20%"
          bg="white"
        >
          <Heading textAlign="center">Create New Device</Heading>
          <Alert
            display={alert ? "flex" : "none"}
            status="error"
            variant="surface"
            title={alert}
          />
          <Field
            invalid={!!nameErrorText}
            label="name"
            errorText={nameErrorText}
          >
            <Input
              placeholder="Enter device name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field
            invalid={!!latitudeErrorText}
            label="latitude"
            errorText={latitudeErrorText}
          >
            <Input
              type="text"
              placeholder="Enter device latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Field>
          <Field
            invalid={!!longitudeErrorText}
            label="longitude"
            errorText={longitudeErrorText}
          >
            <Input
              type="text"
              placeholder="Enter device longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Field>

          <Button
            w="full"
            colorPalette={"teal"}
            onClick={handleCreateDevice}
            loading={isLoading}
            loadingText="Storing the device..."
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default CreateDevice;
