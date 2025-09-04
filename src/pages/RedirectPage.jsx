import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Alert, CircularProgress } from "@mui/material";
import { Repo } from "../core/repo";
import { Logger } from "../core/logger";
import { isExpired } from "../core/utils";

function RedirectPage() {
  const { code } = useParams();
  const [status, setStatus] = useState("loading"); // loading | error | expired | redirect

  useEffect(() => {
    const urlObj = Repo.findByCode(code);

    if (!urlObj) {
      Logger.warn("REDIRECT_NOT_FOUND", { code });
      setStatus("error");
      return;
    }

    if (isExpired(urlObj.expiresAt)) {
      Logger.info("REDIRECT_EXPIRED", { code });
      setStatus("expired");
      return;
    }

    // record click
    const click = {
      code,
      ts: new Date().toISOString(),
      referrer: document.referrer || "direct",
      geo: Intl.DateTimeFormat().resolvedOptions().timeZone, // coarse geo
    };

    Repo.saveClick(click);
    Logger.info("CLICK_RECORDED", click);

    setStatus("redirect");

    // redirect after short delay
    setTimeout(() => {
      window.location.replace(urlObj.longUrl);
    }, 1500);
  }, [code]);

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      {status === "loading" && (
        <>
          <CircularProgress />
          <Typography>Checking link...</Typography>
        </>
      )}

      {status === "error" && (
        <Alert severity="error">This short link does not exist.</Alert>
      )}

      {status === "expired" && (
        <Alert severity="warning">
          This short link has expired and can no longer be used.
        </Alert>
      )}

      {status === "redirect" && (
        <Alert severity="info">Redirecting you to the original URL...</Alert>
      )}
    </Container>
  );
}

export default RedirectPage;
