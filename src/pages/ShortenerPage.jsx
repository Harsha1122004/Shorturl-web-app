import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Alert,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { Repo } from "../core/repo";
import { Logger } from "../core/logger";
import { generateCode, addMinutes, isValidUrl } from "../core/utils";
import dayjs from "dayjs";

function ShortenerPage() {
  const [rows, setRows] = useState([
    { url: "", minutes: "", code: "", error: "" },
  ]);
  const [results, setResults] = useState([]);

  const addRow = () => {
    if (rows.length < 5) {
      setRows([...rows, { url: "", minutes: "", code: "", error: "" }]);
    }
  };

  const handleChange = (i, field, value) => {
    const newRows = [...rows];
    newRows[i][field] = value;
    newRows[i].error = "";
    setRows(newRows);
  };

  const handleShorten = () => {
    const newResults = [];
    const updatedRows = [...rows];

    rows.forEach((row, i) => {
      if (!row.url) return;

      if (!isValidUrl(row.url)) {
        updatedRows[i].error = "Invalid URL";
        Logger.error("INVALID_URL", { url: row.url });
        return;
      }

      let validity = parseInt(row.minutes || "30", 10);
      if (isNaN(validity) || validity <= 0) validity = 30;

      try {
        const code = generateCode(row.code);
        const createdAt = new Date().toISOString();
        const expiresAt = addMinutes(createdAt, validity);

        const urlObj = { code, longUrl: row.url, createdAt, expiresAt };

        Repo.saveUrl(urlObj);
        Logger.info("SHORT_URL_CREATED", urlObj);

        newResults.push(urlObj);
      } catch (err) {
        updatedRows[i].error = err.message;
        Logger.error("SHORTCODE_ERROR", { code: row.code });
      }
    });

    setRows(updatedRows);
    setResults([...results, ...newResults]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <Stack spacing={2}>
        {rows.map((row, i) => (
          <Card key={i} sx={{ p: 2 }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Long URL"
                  value={row.url}
                  onChange={(e) => handleChange(i, "url", e.target.value)}
                  fullWidth
                  error={!!row.error}
                  helperText={row.error}
                />
                <TextField
                  label="Validity (minutes, optional)"
                  value={row.minutes}
                  onChange={(e) => handleChange(i, "minutes", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Custom Shortcode (optional)"
                  value={row.code}
                  onChange={(e) => handleChange(i, "code", e.target.value)}
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        ))}

        {rows.length < 5 && (
          <Button variant="outlined" onClick={addRow}>
            + Add Row
          </Button>
        )}

        <Button variant="contained" onClick={handleShorten}>
          Shorten All
        </Button>

        {results.length > 0 && (
          <Stack spacing={2}>
            <Typography variant="h6">Results</Typography>
            {results.map((r) => (
              <Alert key={r.code} severity="success">
                Short Link:{" "}
                <a
                  href={`/s/${r.code}`}
                  target="_blank"
                  rel="noreferrer"
                >{`http://localhost:3000/s/${r.code}`}</a>
                <br />
                Expires At: {dayjs(r.expiresAt).format("YYYY-MM-DD HH:mm")}
              </Alert>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default ShortenerPage;
