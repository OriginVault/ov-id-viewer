import React, { useState } from "react";
import { Card, CardContent, Container, IconButton, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material"
import "./viewer.css";

interface OVIdViewerProps {
  did: string;
  variant?: "dark" | "light" | "transparent";
  size?: "sm" | "md" | "lg";
}

const OVIdViewer = ({ did, variant = "dark", size = "md" }: OVIdViewerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<any>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const url = `https://resolver.cheqd.net/1.0/identifiers/${did}`;
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', { timeZone });
  };

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        className={`viewer ${variant}`}
        sx={{ 
          cursor: "pointer",
          transition: "all 0.3s ease",
         }}
      >
        <img
          title="OriginVault"
          alt="OriginVaultLogo"
          src="https://gray-objective-tiglon-784.mypinata.cloud/ipfs/Qma7EjPPPfomzEKkYcJa2ctEFPUhHaMwiojTR1wTQPg2x8"
          style={{ width: size === "sm" ? "24px" : size === "md" ? "36px" : "48px", cursor: "pointer" }}
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 2 }}>
          {data ? (
            <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Decentralized Identifier (DID) Document
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  <strong>DID:</strong> {data.didDocument.id}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Created:</strong> {formatDate(data.didDocumentMetadata.created)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Version ID:</strong> {data.didDocumentMetadata.versionId}
                </Typography>
                
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Verification Method</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Public Key</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.didDocument.verificationMethod.map((method, index) => (
                        <TableRow key={index}>
                          <TableCell>{method.id}</TableCell>
                          <TableCell>{method.type}</TableCell>
                          <TableCell>{method.publicKeyMultibase}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" sx={{ mt: 4 }}>
                  Linked Resources
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Resource Name</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Media Type</strong></TableCell>
                        <TableCell><strong>Created</strong></TableCell>
                        <TableCell><strong>Resource URI</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.didDocumentMetadata.linkedResourceMetadata
                        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                        .map((resource, index) => (
                        <TableRow key={index}>
                          <TableCell>{resource.resourceName}</TableCell>
                          <TableCell>{resource.resourceType}</TableCell>
                          <TableCell>{resource.mediaType}</TableCell>
                          <TableCell>{formatDate(resource.created)}</TableCell>
                          <TableCell><a href={resource.resourceURI} target="_blank" rel="noopener noreferrer">View</a></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Container>
          ) : (
            "Loading..."
          )}
        </Typography>
      </Popover>
    </div>
  );
};

export { OVIdViewer, type OVIdViewerProps };

