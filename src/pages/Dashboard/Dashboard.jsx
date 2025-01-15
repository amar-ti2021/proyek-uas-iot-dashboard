import { useEffect, useState } from "react";
import { Grid, GridItem, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { StatLabel, StatRoot, StatValueText } from "@/components/ui/stat";
import { BsDeviceSsd } from "react-icons/bs";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import LeafletMap from "../../components/dashboard/LeafletMap";
import DeviceTable from "../../components/dashboard/DevicesTable/DevicesTable";
import { supabase } from "../../services/supabaseClient";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          link: `/devices/${device.id}`,
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

  // Calculate statistics
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((device) => device.isOnline).length;
  const offlineDevices = totalDevices - onlineDevices;

  // Grid configurations
  const gridTemplateColumn = {
    base: "repeat(1, minmax(0, 1fr))",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  };
  const mapGridStyles = {
    gridColumnStart: { base: 1, xl: 2 },
    gridRowStart: { base: 4, xl: 1 },
    colSpan: { base: 1, md: 2, xl: 3 },
    rowSpan: { base: 1, md: 1, xl: 3 },
    shadow: "sm",
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Grid display="grid" gridTemplateColumns={gridTemplateColumn} gap={5} p={5}>
      <GridItem shadow="sm" aspectRatio={"3"} asChild>
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Total Devices</StatLabel>
              <StatValueText>
                <Text pl={8} textStyle="5xl">
                  {totalDevices}
                </Text>
              </StatValueText>
            </Stack>
            <Icon size={"2xl"}>
              <BsDeviceSsd />
            </Icon>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm" aspectRatio={"3"} asChild>
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Online Devices</StatLabel>
              <StatValueText>
                <Text pl={8} textStyle="5xl">
                  {onlineDevices}
                </Text>
              </StatValueText>
            </Stack>
            <Icon size={"2xl"}>
              <HiStatusOnline />
            </Icon>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm" aspectRatio={"3"} asChild>
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Offline Devices</StatLabel>
              <StatValueText>
                <Text pl={8} textStyle="5xl">
                  {offlineDevices}
                </Text>
              </StatValueText>
            </Stack>
            <Icon size={"2xl"}>
              <HiStatusOffline />
            </Icon>
          </HStack>
        </StatRoot>
      </GridItem>

      <GridItem
        gridColumnStart={mapGridStyles.gridColumnStart}
        gridRowStart={mapGridStyles.gridRowStart}
        colSpan={mapGridStyles.colSpan}
        rowSpan={mapGridStyles.rowSpan}
        shadow={mapGridStyles.shadow}
      >
        <LeafletMap markers={markers} />
      </GridItem>
      <GridItem colSpan={4} shadow={"sm"} p={5}>
        <DeviceTable devices={devices} />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
