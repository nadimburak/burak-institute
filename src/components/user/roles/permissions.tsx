import { IPermission } from "@/models/user/Permission.model";
import axiosInstance from "@/utils/axiosInstance";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface FormSelectProps {
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
}

const PermissionSelect: React.FC<FormSelectProps> = ({
  value = [],
  onChange,
}) => {
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get("/user/all-permissions");
        setPermissions(response.data as IPermission[]);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleToggle = (id: string) => {
    const updated = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange?.(updated);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = permissions.map((p) => p._id);
      onChange?.(allIds);
    } else {
      onChange?.([]);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = permissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const allSelected = value.length > 0 && value.length === permissions.length;
  const isIndeterminate = value.length > 0 && value.length < permissions.length;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Permission Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              visibleRows.map((permission) => (
                <TableRow key={permission._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={value.includes(permission._id)}
                      onChange={() => handleToggle(permission._id)}
                    />
                  </TableCell>
                  <TableCell>{permission.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Selected: {value.length}
        </Typography>

        <TablePagination
          component="div"
          count={permissions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>
    </Box>
  );
};

export default PermissionSelect;
