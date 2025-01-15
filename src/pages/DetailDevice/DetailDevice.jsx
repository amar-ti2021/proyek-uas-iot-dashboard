import { useEffect, useState } from "react";
import { Grid, GridItem, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { StatLabel, StatRoot, StatValueText } from "@/components/ui/stat";
import { BsDeviceSsd } from "react-icons/bs";
import LeafletMap from "../../components/dashboard/LeafletMap";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "react-router-dom";

const DetailDevice = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [latestStats, setLatestStats] = useState({
    humidity: 0,
    temperature: 0,
    smoke_level: 0,
    smoke_status: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch the specific device by ID
        const { data: deviceData, error: deviceError } = await supabase
          .from("devices")
          .select("*")
          .eq("id", id)
          .single();

        if (deviceError) throw deviceError;
        setDevice(deviceData);

        // Fetch the latest statistics for this device
        const { data: statisticsData, error: statisticsError } = await supabase
          .from("device_statistics")
          .select("*")
          .eq("device_key", deviceData.key)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (statisticsError) throw statisticsError;
        setLatestStats(statisticsData);
      } catch (error) {
        console.error("Error fetching device data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time subscription for updates on device_statistics for this device
    const statisticsSubscription = supabase
      .channel("device_statistics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "device_statistics",
          filter: `device_key=eq.${device?.key}`,
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statisticsSubscription);
    };
  }, [id, device?.key]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!device || !latestStats) {
    return <Text>No data available for this device.</Text>;
  }

  const { humidity, temperature, smoke_level, smoke_status } = latestStats;

  return (
    <Grid
      display="grid"
      gridTemplateColumns={{
        base: "repeat(1, minmax(0, 1fr))",
        md: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(4, minmax(0, 1fr))",
      }}
      gap={5}
      p={5}
    >
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Device Name</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">{device.name}</Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Device Status</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">
                  {device.isOnline ? "Online" : "Offline"}
                </Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm" colSpan={"2"}>
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Device Key</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">{device.key}</Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Humidity</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">{humidity.toFixed(1)}%</Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Temperature</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">{temperature.toFixed(1)}°C</Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Smoke Level</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">{smoke_level}</Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem shadow="sm">
        <StatRoot borderWidth="1px" p="4" rounded="md">
          <HStack justify="space-between">
            <Stack>
              <StatLabel>Smoke Status</StatLabel>
              <StatValueText>
                <Text textStyle="5xl">
                  {smoke_status ? "Smoke Detected" : "Not detected"}
                </Text>
              </StatValueText>
            </Stack>
          </HStack>
        </StatRoot>
      </GridItem>
      <GridItem
        shadow="sm"
        rowSpan={{ base: 1, md: 2, lg: 4 }}
        colSpan={{ base: 1, md: 2, lg: 2 }}
        gridColumnStart={{ base: 5, lg: 3 }}
        gridRowStart={{ base: 5, lg: 1 }}
      >
        <LeafletMap
          markers={[
            {
              position: [device.latitude, device.longitude],
              title: device.name,
              link: `/dashboard/devices/${device.id}`,
              linkText: "Learn more",
            },
          ]}
        />
      </GridItem>
    </Grid>
  );
};

export default DetailDevice;
