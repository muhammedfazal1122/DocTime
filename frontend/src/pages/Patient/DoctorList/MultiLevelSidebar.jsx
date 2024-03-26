import React, { useRef, useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { PresentationChartBarIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export default function MultiLevelSidebar() {
  const [open, setOpen] = React.useState(0);
  const sidebarRef = useRef(null);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    function handleResize() {
      if (sidebarRef.current) {
        sidebarRef.current.style.height = `${window.innerHeight}px`;
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="w-full max-w-[20rem] p-2 shadow-2xl shadow-blue-gray-900/5 overflow-y-auto "
    >
      <Card className="w-full p-2">
        <div className="mb-2 p-8">
          <Typography variant="h5" color="blue-gray">
            Filter
          </Typography>
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0 " selected={open === 1}>
              <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                Specialization
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                General
                </ListItem>
                {/* Add more list items as needed */}
              </List>
            </AccordionBody>
          </Accordion>

          {/* Add more Accordion components as needed */}
        </List>
      </Card>
    </div>
  );
}
