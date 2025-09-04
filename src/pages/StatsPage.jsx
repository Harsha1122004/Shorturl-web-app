import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { Repo } from "../core/repo";
import { Logger } from "../core/logger";
import { isExpired } from "../core/utils";

function StatsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(Repo.allUrls());
    Logger.info("STATS_VIEWED");
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      <Stack spacing={2}>
        {urls.length === 0 && (
          <Typography>No short URLs created yet.</Typography>
        )}

        {urls.map((u) => {
          const clicks = Repo.clicksFor(u.code);
          const expired = isExpired(u.expiresAt);

          return (
            <Card key={u.code}>
              <CardContent>
                <Typography variant="h6">
                  {`http://localhost:3000/s/${u.code}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Original: {u.longUrl}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={`Created: ${dayjs(u.createdAt).format(
                      "YYYY-MM-DD HH:mm"
                    )}`}
                  />
                  <Chip
                    label={`Expires: ${dayjs(u.expiresAt).format(
                      "YYYY-MM-DD HH:mm"
                    )}`}
                    color={expired ? "error" : "primary"}
                  />
                  <Chip
                    label={`Total Clicks: ${clicks.length}`}
                    color="success"
                  />
                </Stack>

                {clicks.length > 0 && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Click Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {clicks.map((c, idx) => (
                          <ListItem key={idx}>
                            <ListItemText
                              primary={`Clicked at ${dayjs(c.ts).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}`}
                              secondary={`Referrer: ${c.referrer} | Geo: ${c.geo}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}

export default StatsPage;
