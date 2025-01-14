import { HStack, Heading, Stack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import PropTypes from "prop-types";
import { useState } from "react";

const DeviceTable = ({ devices }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDevices = devices.slice(startIndex, endIndex);

  return (
    <Stack width="full" gap="5">
      <Heading size="xl">Devices List</Heading>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Latitude</Table.ColumnHeader>
            <Table.ColumnHeader>Longitude</Table.ColumnHeader>
            <Table.ColumnHeader>Is Online</Table.ColumnHeader>
            <Table.ColumnHeader>Action</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedDevices.map((device, index) => (
            <Table.Row key={index}>
              <Table.Cell>{device.name}</Table.Cell>
              <Table.Cell>{device.latitude}</Table.Cell>
              <Table.Cell>{device.longitude}</Table.Cell>
              <Table.Cell>{device.isOnline ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>
                <button onClick={() => handleAction(device.id)}>View</button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <PaginationRoot
        count={Math.ceil(devices.length / pageSize)}
        pageSize={pageSize}
        page={currentPage}
      >
        <HStack wrap="wrap">
          <PaginationPrevTrigger
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
          <PaginationItems />
          <PaginationNextTrigger
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(devices.length / pageSize))
              )
            }
          />
        </HStack>
      </PaginationRoot>
    </Stack>
  );

  function handleAction(deviceId) {
    console.log(`Action triggered for device with ID: ${deviceId}`);
    // Add your logic here for handling device actions
  }
};

DeviceTable.propTypes = {
  devices: PropTypes.array.isRequired,
};

export default DeviceTable;
