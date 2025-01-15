import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Box, Button, Card, Grid, GridItem, Text } from "@chakra-ui/react";
import LeafletMap from "../../components/dashboard/LeafletMap";
import { Link } from "react-router-dom";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  const gridTemplateColumn = {
    base: "repeat(1, minmax(0, 1fr))",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch devices
        const { data: devicesData, error: devicesError } = await supabase
          .from("devices")
          .select("*");
        console.log("Devices Data:", devicesData); // Log the response data
        if (devicesError) throw devicesError;

        // Fetch device_statistics
        const { data: statisticsData, error: statisticsError } = await supabase
          .from("device_statistics")
          .select("*");
        console.log("Device Statistics Data:", statisticsData); // Log the response data
        if (statisticsError) throw statisticsError;

        // Calculate isOnline based on the latest statistics
        const now = new Date();
        const enrichedDevices = devicesData.map((device) => {
          const latestStat = statisticsData
            .filter((stat) => stat.device_key === device.key)
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

          const isOnline =
            latestStat &&
            (now.getTime() - new Date(latestStat.created_at).getTime()) /
              1000 /
              60 <=
              5;

          return {
            ...device,
            isOnline,
          };
        });

        setDevices(enrichedDevices);

        // Prepare markers for the map
        const markersData = enrichedDevices.map((device) => ({
          position: [device.latitude, device.longitude],
          title: device.name,
          link: `/dashboard/devices/${device.id}`,
          linkText: "Learn more",
        }));
        setMarkers(markersData);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error.message); // Log errors
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up real-time updates
    const deviceSubscription = supabase
      .channel("devices")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "devices" },
        (payload) => {
          console.log("change received!", payload);
          fetchData();
        }
      )
      .subscribe();

    const statisticsSubscription = supabase
      .channel("device_statistics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "device_statistics" },
        (payload) => {
          console.log("change receieved!", payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deviceSubscription);
      supabase.removeChannel(statisticsSubscription);
    };
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Button asChild w={"80px"} size={"xs"} m={5}>
        <Link to={"add"}>Add New</Link>
      </Button>
      <Grid gridTemplateColumns={gridTemplateColumn} gap={5} p={5}>
        {devices.map((device, index) => {
          return (
            <GridItem key={device.id} asChild>
              <Card.Root maxW="sm" overflow="hidden">
                <Box w={"100%"} minH={"150px"}>
                  <LeafletMap markers={[markers[index]]} />
                </Box>
                <Card.Body gap="2">
                  <Card.Title>{device.name}</Card.Title>
                  <Card.Description>
                    {/* {device.latitude}, {device.longitude} */}
                    {device.key}
                  </Card.Description>
                  <Text
                    textStyle="2xl"
                    fontWeight="medium"
                    letterSpacing="tight"
                    mt="2"
                  >
                    {device.isOnline ? "Online" : "Offline"}
                  </Text>
                </Card.Body>
                <Card.Footer gap="2">
                  <Button variant="solid" asChild>
                    <Link to={`${device.id}`}>View</Link>
                  </Button>
                </Card.Footer>
              </Card.Root>
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};
export default Devices;
