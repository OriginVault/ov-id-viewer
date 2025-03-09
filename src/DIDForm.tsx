import React from 'react';
import { Popper, Container, Box, Typography, createTheme, ThemeProvider, Collapse, IconButton, Link, AccordionDetails, Accordion, AccordionSummary, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { VerifiedUserOutlined } from '@mui/icons-material';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { format, toZonedTime } from 'date-fns-tz';

const theme = createTheme();

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const formatDate = (date: string) => {
  const zonedDate = toZonedTime(new Date(date), timeZone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone });
};

interface DIDFetchResponse {
  "@context": string;
  didDocument: {
    "@context": string[];
    id: string;
    controller: string[];
    verificationMethod: {
      id: string;
      type: string;
      controller: string;
      publicKeyMultibase: string;
    }[];
    authentication: string[];
  };
  didResolutionMetadata: {
    contentType: string;
    retrieved: string;
    did: {
      didString: string;
      methodSpecificId: string;
      method: string;
    };
  };
  didDocumentMetadata: {
    created: string;
    versionId: string;
    linkedResourceMetadata: {
      resourceURI: string;
      resourceCollectionId: string;
      resourceId: string;
      resourceName: string;
      resourceType: string;
      mediaType: string;
      resourceVersion: string;
      created: string;
      checksum: string;
      previousVersionId: string | null;
      nextVersionId: string | null;
    }[];
  };
}

const schema: RJSFSchema = {
  type: "object",
  properties: {
    did: {
      type: "string",
      title: "DID"
    },
    created: {
      type: "string",
      title: "Created",
      format: "date-time"
    },
    version: {
      type: "string",
      title: "Version"
    },
    verificationMethods: {
      type: "array",
      title: "Verification Methods",
      items: {
        type: "object",
        properties: {
          id: { type: "string", title: "ID" },
          type: { type: "string", title: "Type" }
        }
      }
    },
    linkedResources: {
      type: "array",
      title: "Linked Resources",
      items: {
        type: "object",
        properties: {
          resourceName: { type: "string", title: "Resource Name" },
          resourceURI: { type: "string", title: "Resource URI" },
          created: { type: "string", title: "Published On", format: "date-time" }
        }
      }
    }
  }
};

const formatResource = (resource: any) => {
  return {
    ...resource,
    created: formatDate(resource.created)
  }
}

const DIDForm = ({ data, title, onClose, validatedAt, resourceTypes, resourceRenderer }: { data: DIDFetchResponse, title?: string, onClose: () => void, validatedAt: Date | null, resourceTypes?: string[] | undefined, resourceRenderer?: (resource: any) => React.ReactNode }) => {
  const sortedTypes = resourceTypes?.sort((a: string, b: string) => a.localeCompare(b));
  const uiSchema: UiSchema = {
    "ui:submitButtonOptions": { norender: true },
    linkedResources: {
      "ui:options": {
        orderable: false
      },
      "ui:widget": (props) => {
        const groupedResources: Record<string, DIDFetchResponse['didDocumentMetadata']['linkedResourceMetadata']> = props.value.reduce((acc: any, resource: any) => {
          const type = resource.resourceType || 'Unknown'; // Group by resource type
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(resource);
          return acc;
        }, {});

        return (
          <div>
            {sortedTypes?.map((type: string) => {
              const resources = groupedResources[type];
              const sortedResources = resources.sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime());
              return (
                resourceRenderer ? resourceRenderer(resources) : 
                  <div key={type} style={{ marginBottom: '14px' }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '10px' }}>
                      <Typography variant="h6">{type} ({resources.length})</Typography>
                      <Typography variant="body2">Latest Version: {sortedResources[0].resourceVersion}</Typography>
                    </Box>
                    {sortedResources.map((resource: any, index: number) => (
                      <Accordion key={resource.resourceName}>
                          <AccordionSummary style={{ backgroundColor: '#1c2a35', color: '#add4ef' }}>
                              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <Typography variant="body2">{`${resource.resourceName} #${index + 1} `}</Typography>
                                <Typography variant="body2">Created: {formatDate(resource.created)}</Typography>
                              </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2">
                              <Link href={`https://resolver.cheqd.net/1.0/identifiers/${resource.resourceURI}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '10px', cursor: 'pointer' }}>
                                Resource Details
                              </Link>
                            </Typography>
                            <TableContainer>
                              <Table style={{ width: '100%' }}>
                                <TableBody>
                                  {Object.entries(resource).map(([key, value]) => (
                                    <TableRow key={key}>
                                      <TableCell style={{ fontSize: '12px', padding: '4px' }}>{key}</TableCell>
                                      <TableCell style={{ fontSize: '12px', padding: '4px' }}>{value as any}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                    ))}
                  </div>
                )
            })}
          </div>
        );
      }
    },
    did: {
      "ui:widget": "hidden"
    },
    created: {
      "ui:widget": "hidden"
    },
    version: {
      "ui:widget": "hidden"
    },
    verificationMethods: {
      "ui:widget": "hidden"
    }
  };

  if (!data) return null;

  // Transform the raw data into the shape required by our form schema
  const formData = {
    did: data.didDocument.id,
    created: formatDate(data.didDocumentMetadata.created),
    version: data.didDocumentMetadata.versionId,
    verificationMethods: data.didDocument.verificationMethod.map(method => ({
      id: method.id,
      type: method.type
    })),
    linkedResources: data.didDocumentMetadata.linkedResourceMetadata.filter(resource => resourceTypes?.includes(resource.resourceType))
  };
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleShowPopper = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.focus();
    setAnchorEl(event.currentTarget);
  };

  const handleHidePopper = () => {
    setAnchorEl(null);
  };

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleHidePopper();
    } else {
      handleShowPopper(event);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Box onMouseLeave={handleHidePopper}>
            <Popper style={{ 
              zIndex: 1300, 
              backgroundColor: '#1c2a35', 
              padding: '10px',
              borderRadius: '10px',
              color: '#add4ef',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }} open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom">
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid #1c2a35',
                borderRadius: '10px',
                position: 'absolute',
                top: '-4px',
                left: '20%',
              }}></div>
              <Typography variant="subtitle2" sx={{
                display: 'flex',
                alignItems: 'center',
                "&:hover": {
                  color: '#fe9334'
                }
              }}>
                <VerifiedUserOutlined style={{ width: '16px', height: '16px', marginRight: '1px' }}/>
                <Link style={{ color: 'inherit', textDecoration: 'none' }} href={`https://resolver.cheqd.net/1.0/identifiers/${formData.did}`} target="_blank">{formData.did}</Link>
              </Typography>
            </Popper>
            <Box
              style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  width: '100%'
              }} 
            >
              <Typography 
                variant="h5" 
                align="center" 
                gutterBottom 
                sx={{ marginBottom: '10px' }}
                onClick={onClick} 
                onMouseEnter={handleShowPopper}
              >
                {title}
              </Typography>
              <Box
                style={{ 
                  display: 'flex',
                  alignItems: 'center', 
                  justifyContent: 'flex-start', 
                  flexDirection: 'row',
                  cursor: 'pointer',
                  paddingBottom: '2px'
                }}
              >
                <img
                  title="OriginVault"
                  alt="OriginVaultLogo"
                  src="https://gray-objective-tiglon-784.mypinata.cloud/ipfs/Qma7EjPPPfomzEKkYcJa2ctEFPUhHaMwiojTR1wTQPg2x8"
                  style={{ width: "24px" }}
                />
                <Typography style={{ paddingLeft: '4px',  fontSize: '12px', cursor: 'pointer' }}>
                  OV Verified DID Document
                </Typography>
                
              </Box>
            </Box>
            <Typography style={{ paddingLeft: '4px',  fontSize: '10px', cursor: 'pointer', fontStyle: 'italic' }}>
              Created At: {formatDate(formData.created)}
            </Typography>
            <Typography style={{ paddingLeft: '4px',  fontSize: '10px', cursor: 'pointer', fontStyle: 'italic' }}>
              Validated At: {validatedAt ? formatDate(validatedAt.toISOString()) : ''}
            </Typography>
          </Box>
          <IconButton onClick={() => onClose()}>
            <Collapse />
          </IconButton>
          <Form schema={schema} uiSchema={uiSchema} formData={formData} validator={validator} disabled readonly />
      </Container>
    </ThemeProvider>
  );
};

export default DIDForm;
