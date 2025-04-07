import React, { useState } from "react";
import { CircularProgress, IconButton, Popover } from "@mui/material"
import DIDForm from "./DIDForm";

interface OVIdViewerProps {
  did: string;
  size?: "sm" | "md" | "lg";
  title?: string;
  render?: (data: any) => React.ReactNode;
  renderProps?: {
    title?: string;
    onClose: () => void;
    validatedAt: Date | null;
    [key: string]: any;
  };
  resourceTypes?: string[];
  resourceRenderer?: (resource: any) => React.ReactNode;
  isHoverable?: boolean;
  isMobile?: boolean;
  isHovering?: boolean;
  showByDefault?: boolean;
}

const OVIdViewer = ({ did, size = "md", title, render, renderProps, resourceTypes, resourceRenderer, isHoverable = false, isMobile = false, isHovering = false, showByDefault = true }: OVIdViewerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<any>(null);
  const [validatedAt, setValidatedAt] = useState<Date | null>(null);
  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const url = `https://resolver.cheqd.net/1.0/identifiers/${did}`;
    try {
      const response = await fetch(url);
      setValidatedAt(new Date());
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setData(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const childProps = {
    data,
    renderProps,
    resourceTypes,
    resourceRenderer,
    open,
    handleClose,
  }

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={showByDefault ?
          {
            opacity: 1,
          } 
          :
          {
            opacity: isHoverable && (isHovering || isMobile) ? 0.3 : 0,
            transition: "opacity 0.3s ease",
            '&:hover': {
              opacity: isHoverable ? 1 : 0,
            },
          }
        }
      >
        {open && data === null ? 
          <CircularProgress size={size === "sm" ? 24 : size === "md" ? 36 : 48} style={{ color: '#f2d087' }}/>
         : (
          <img
            title="Origin Information"
            alt="Origin Information"
            src="https://gray-objective-tiglon-784.mypinata.cloud/ipfs/Qma7EjPPPfomzEKkYcJa2ctEFPUhHaMwiojTR1wTQPg2x8"
            style={{ width: size === "sm" ? "24px" : size === "md" ? "36px" : "48px", cursor: "pointer" }}
          />
        )}
      </IconButton>
      <Popover
        id={id}
        open={open && data !== null}
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
        slotProps={{
          paper: {
            style: {
              backgroundColor: '#f2d087',
            },
          },
        }}
      >
        {render ? render(childProps) : 
          <DIDForm 
            data={data} 
            title={title} 
            onClose={handleClose} 
            validatedAt={validatedAt} 
            resourceTypes={resourceTypes}
            resourceRenderer={resourceRenderer}
          />
        }
      </Popover>
    </div>
  );
};

export { OVIdViewer, type OVIdViewerProps };

